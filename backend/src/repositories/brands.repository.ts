import { AppDataSource } from "@/config/database";
import { SearchBrandDto } from "@/dto/brands/search-brand.dto";
import { PaginationDto } from "@/dto/pagination/pagination.dto";
import { Brand } from "@/entities/brands.entity";
import { BadRequestException, NotFoundException } from "@/exceptions/app-error";
import { FindManyOptions, IsNull, Like, Repository } from "typeorm";

export class BrandRepository {
  private readonly brandRepo: Repository<Brand>;
  constructor() {
    this.brandRepo = AppDataSource.getRepository(Brand);
  }

  findAllBrands = async (pagination?: PaginationDto): Promise<{items: Brand[], total: number}> =>{
    const { page = 1, limit = 10 } = pagination || {};
    const skip = (page - 1) * limit;

    const findOptions: FindManyOptions<Brand> = {
      where: { deletedAt: IsNull() },
      order: { createdAt: "DESC" },
      skip: skip,
      take: limit
    };

    const [ items, total] = await this.brandRepo.findAndCount(findOptions);
    return { items, total };
  }

  findByBrandId = async (brandId: number): Promise<Brand> => {
    const brand = await this.brandRepo.findOne({ where: { id: brandId, deletedAt: IsNull() } });
    if(!brand) {
      throw new NotFoundException(`Not found brand with id: ${brandId}`);
    }
    return brand;
  }

  search = async (pagination?: SearchBrandDto): Promise<{items: Brand[], total: number}> => {
    const { page = 1, limit = 10} = pagination || {};
    const skip = (page - 1) * limit;

    const findOptions: FindManyOptions<Brand> = {
      where: {
        name: Like(`%${pagination?.name}%`),
        deletedAt: IsNull()
      },
      order: { createdAt: 'DESC' },
      skip,
      take: limit
    };

    const [items, total] = await this.brandRepo.findAndCount(findOptions);
    return { items, total };
  }

  create = async (data: Partial<Brand>): Promise<Brand> => {
    const newBrand = await this.brandRepo.create(data);
    return await this.brandRepo.save(newBrand);
  }

  update = async (id: number, data: Partial<Brand>): Promise<Brand> => {
    const brand = await this.findByBrandId(id);

    Object.assign(brand, data);
    return await this.brandRepo.save(brand);
  }

  isActiveBrand = async (brandId: number): Promise<Brand> => {
    const brand = await this.findByBrandId(brandId);

    Object.assign(brand, { isActive: !brand.isActive });
    return await this.brandRepo.save(brand);
  }

  delete = async (brandId: number): Promise<string> => {
    const result = await this.brandRepo.softDelete(brandId);
    if(result.affected === 0) {
      throw new BadRequestException(`Not found brand with id: ${brandId}`);
    }

    return `Delete brand with id ${brandId} successfully.`;
  }
}