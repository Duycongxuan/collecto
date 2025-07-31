import { AppDataSource } from "@/config/database";
import { PaginationDto } from "@/dto/pagination/pagination.dto";
import { Brand } from "@/entities/brands.entity";
import { AppError } from "@/utils/app-error";
import { FindManyOptions, IsNull, Repository } from "typeorm";

export class BrandRepository {
  private brandRepo: Repository<Brand>;
  constructor() {
    this.brandRepo = AppDataSource.getRepository(Brand);
  }

  findAll = async (pagination?: PaginationDto): Promise<{items: Brand[], total: number}> =>{
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

  findById = async (id?: number): Promise<Brand> => {
    const brand = await this.brandRepo.findOne({ where: { id: id, deletedAt: IsNull() } });
    if(!brand) {
      throw new AppError(`Not found brand with id ${id}`, 404);
    }
    return brand;
  }

  findByName = async (name: string): Promise<any> => {
    return await this.brandRepo.findOne({ where: { name: name, deletedAt: IsNull()} });
  }

  create = async (data: Partial<Brand>): Promise<Brand> => {
    const newBrand = await this.brandRepo.create(data);
    return await this.brandRepo.save(newBrand);
  }

  update = async (id: number, data: Partial<Brand>): Promise<Brand> => {
    const brand = await this.findById(id);

    Object.assign(brand, data);
    return await this.brandRepo.save(brand);
  }

  delete = async (id: number): Promise<string> => {
    const result = await this.brandRepo.softDelete(id);
    if(result.affected === 0) {
      throw new AppError(`Not found brand with id ${id}`, 404);
    }

    return `Delete brand with id ${id} successfully.`;
  }
}