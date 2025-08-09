import { AppDataSource } from "@/config/database";
import { PaginationDto } from "@/dto/pagination/pagination.dto";
import { SearchProductDto } from "@/dto/products/search-product.dto";
import { ProductImage } from "@/entities/productImage";
import { Product } from "@/entities/products.entity";
import { BadRequestException, InternalException, NotFoundException } from "@/exceptions/app-error";
import { FindManyOptions, FindOneOptions, In, IsNull, Like, Repository } from "typeorm";

export class ProductRepository {
  private readonly productRepository: Repository<Product>
  constructor() {
    this.productRepository = AppDataSource.getRepository(Product);
  }

  findByProductId = async (productId: number): Promise<Product> => {
    const findOptions: FindOneOptions<Product> = {
      where: {
        id: productId,
        category: { deletedAt: IsNull() },
        deletedAt: IsNull(),
        brand: { deletedAt: IsNull() }
      },
      relations: ['brand', 'category', 'images'],
    };

    const product = await this.productRepository.findOne(findOptions);

    if (!product) {
      throw new NotFoundException(`Not found product with id: ${productId}`);
    }
    return product;
  };

  findAllProducts = async (pagination?: PaginationDto): Promise<{ items: Partial<Product>[], total: number}> => {
    const { page = 1, limit = 10} = pagination || {};
    const skip = (page - 1) * limit;

    const findOptions: FindManyOptions<Product> = {
      relations: ['brand', 'images', 'category'],
      select:
        {
          id: true,
          name: true,
          sellingPrice: true,
          images: { imageUrl: true },
          brand: { name: true },
          category: { name: true },
          isActive: true,
          createdAt: true
        },
      where: { 
        category: { deletedAt: IsNull() },
        deletedAt: IsNull(),
        images: { isPrimary: true },
        brand: { deletedAt: IsNull() }
        },
      order: { createdAt: 'DESC' },
      skip: skip,
      take: limit
    };

    const [items, total] = await this.productRepository.findAndCount(findOptions);
    return { items, total }
  };

  search = async (pagination: SearchProductDto): Promise<{items: Product[], total: number}> => {
    const { page = 1, limit = 10 } = pagination || {};
    const skip = (page - 1) * limit;
    const name = pagination.name;

    const findOptions: FindManyOptions<Product> = {
      relations: ['brand', 'images', 'category'],
      select:
        {
          id: true,
          name: true,
          sellingPrice: true,
          images: { imageUrl: true },
          brand: { name: true },
          category: { name: true },
          isActive: true,
          createdAt: true
        },
      where: { 
        name: Like(`%${name}%`),
        category: { deletedAt: IsNull() },
        deletedAt: IsNull(),
        images: { isPrimary: true },
        brand: { deletedAt: IsNull() }
        },
      order: { createdAt: 'DESC' },
      skip: skip,
      take: limit
    };

    const [items, total] = await this.productRepository.findAndCount(findOptions); 
    return { items, total }
  }

  create = async (data: Partial<Product>, images: Partial<ProductImage>[]): Promise<any> => {
    try {
      const product = await this.productRepository.manager.transaction( async (transactionEntityManager) => {
        const product = await transactionEntityManager.save(Product, data);

        for(const image of images) {
          image.productId = product.id;
          await transactionEntityManager.save(ProductImage, image)
        }
        return product;
      });
      return await this.findByProductId(Number(product.id));
    } catch (error) {
      throw new BadRequestException(`Failed to create new product: ${error}`);
    }
  }

  update = async (productId: number, data: Partial<Product>, imageIds?: number[], images?: Partial<ProductImage>[]): Promise<Product> => {
    try {
      await this.productRepository.manager.transaction( async (transactionEntityManager) => {
        const product = await this.findByProductId(productId);

        Object.assign(product, data);
        await transactionEntityManager.save(Product, product);

        if(imageIds && imageIds.length > 0) {
          const images = await transactionEntityManager.delete(ProductImage, { id : In(imageIds), productId});
          if(images.affected === 0) {
            throw new NotFoundException('Not found product images.')
          }
        }

        if(images && images.length > 0) {
          const newImages = images.map(
            image => {
              return transactionEntityManager.create(ProductImage, {
                ...image, 
                product: product
              })
            }
          );

          await transactionEntityManager.save(newImages);
        }

        const remainImages = await transactionEntityManager
          .createQueryBuilder(ProductImage, 'image')
          .where('image.productId = :productId', { productId })
          .orderBy('image.createdAt', 'ASC')
          .getMany();

        for(let i = 0; i < remainImages.length; i++) {
          remainImages[i].isPrimary = (i === 0);
          remainImages[i].sortOrder = i + 1;
        }
        
        await transactionEntityManager.save(remainImages);

        return product;
      });

      return await this.findByProductId(productId);
    } catch (error) {
      throw new BadRequestException(`Failed to update product: ${error}`);
    }
  }

  isActiveProduct = async (productId: number): Promise<Product> => {
    const product = await this.findByProductId(productId);
    Object.assign(product, {isActive: !product.isActive });
    return product;
  }

  delete = async (productId: number): Promise<string> => {
    const result = await this.productRepository.softDelete(productId);
    if(result.affected === 0 ) {
      throw new NotFoundException(`Not found product with id: ${productId}`);
    }

    return `Deleted product with id: ${productId} successfully.`;
  }
}