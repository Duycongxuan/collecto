import { Product } from "@/entities/products.entity";
import { ProductRepository } from "@/repositories/products.repository";
import { UploadService } from "./upload.service";
import { ProductImage } from "@/entities/productImage";
import { BadRequestException } from "@/exceptions/app-error";
import { PaginationDto } from "@/dto/pagination/pagination.dto";
import { SearchProductDto } from "@/dto/products/search-product.dto";
import { ProductImageRepository } from "@/repositories/productImage.repository";

export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly imageProductRepository: ProductImageRepository,
    private readonly uploadService: UploadService
  ) {}

  findByProductId = async (productId: number): Promise<any > => {
   return await this.productRepository.findByProductId(productId);
  }

  findAllProducts = async (pagination?: PaginationDto): Promise<{ items: Partial<Product>[], total: number}> => {
    return await this.productRepository.findAllProducts(pagination);
  }
  search = async (pagination: SearchProductDto): Promise<{ items: Partial<Product>[], total: number}> => {
    return await this.productRepository.search(pagination);
  }

  create = async (data: Partial<Product>, images: Express.Multer.File[]): Promise<any> => {
    const results = await this.uploadService.uploadMultipleImage(images, 'products');
    let imageProducts: Partial<ProductImage>[] = [];

    results.forEach((image, idx, __) => {
      const newImage: Partial<ProductImage> = {
        publicId: image.publicId,
        imageUrl: image.imageUrl,
        sortOrder: idx + 1,
      }

      if(idx === 0 ) {
        newImage.isPrimary = true;
      } 
      imageProducts.push(newImage);
    });

    if(!imageProducts) {
      throw new BadRequestException('No image for product. Please upload image.');
    };

    return await this.productRepository.create(data, imageProducts);
  }

  update = async(productId: number, productInfo: Partial<Product>, imageIds?: number[], images?: Express.Multer.File[]): Promise<Product> => {
    const originalProduct = await this.productRepository.findByProductId(productId);
    let newImageData: Partial<ProductImage>[] = [];

    const isUnChanged = Object.keys(productInfo).every(
      (key) => {
        const newValue = productInfo[key as keyof Product];
        const oldValue = originalProduct[key as keyof Product];
        // So sánh sâu nếu cần (ví dụ: sử dụng thư viện như lodash)
        return JSON.stringify(newValue) === JSON.stringify(oldValue);
      }
    );
    
    if(imageIds && imageIds.length > 0) {
      const images = await this.imageProductRepository.findAllImages(imageIds);

      for(let i=0; i<imageIds.length; i++){
        await this.uploadService.deleteImage(images[i].publicId!);
      }
    }

    if(images && images.length > 0) {
      const results = await this.uploadService.uploadMultipleImage(images, 'products');   
      newImageData = results.map(image => ({
        publicId: image.publicId,
        imageUrl: image.imageUrl
      }));
    }

    if(isUnChanged && (!imageIds || imageIds.length === 0) && (!newImageData || newImageData.length === 0)) {
      throw new BadRequestException('Provided data matches current information. No changes were made.');
    }

    return await this.productRepository.update(productId, productInfo, imageIds, newImageData);
  }

  isActiveProduct = async (productId: number): Promise<Product> => {
    return await this.productRepository.isActiveProduct(productId);
  }

  delete = async (productId: number): Promise<string> => {
    return await this.productRepository.delete(productId);
  }
}