import { AppDataSource } from "@/config/database";
import { SearchCategoryDto } from "@/dto/categories/search-category.dto";
import { PaginationDto } from "@/dto/pagination/pagination.dto";
import { Category } from "@/entities/categories.entity";
import { NotFoundException } from "@/exceptions/app-error";
import { ICategoryRepository } from "@/interfaces/repositories/category.interface";
import { FindManyOptions, IsNull, Like, Repository } from "typeorm";

export class CategoryRepository implements ICategoryRepository{
  private readonly categoryRepo: Repository<Category>;
  constructor() {
    this.categoryRepo = AppDataSource.getRepository(Category);
  }

  findAllCategories = async (pagination?: PaginationDto): Promise<{ items: Category[], total: number}> => {
    const { page = 1, limit = 10 } = pagination || {};
    const skip = (page - 1) * limit;

    const findOptions: FindManyOptions<Category> = {
      where: {
        deletedAt: IsNull()
      },
      order: { createdAt: 'DESC' },
      skip: skip,
      take: limit
    };

    const [items, total ]= await this.categoryRepo.findAndCount(findOptions);

    return { items, total };
  }

  findByCategoryId = async (categoryId: number): Promise<Category> => {
    const category = await this.categoryRepo.findOne({ where: { id: categoryId, deletedAt: IsNull() } });

    if(!category) {
      throw new NotFoundException(`Not found category with id: ${categoryId}`);
    }

    return category;
  }

  search = async (pagination?: SearchCategoryDto): Promise<{items: Category[], total: number}> => {
    const { page = 1, limit = 10 } = pagination || {};
    const skip = (page - 1) * limit;

    const findOptions: FindManyOptions<Category> = {
      where: { 
        name: Like(`%${pagination?.name}%`),
        deletedAt: IsNull() 
      },
      order: { createdAt: 'desc'},
      skip: skip,
      take: limit
    }

    const [items, total] = await this.categoryRepo.findAndCount(findOptions);
    if(total === 0) {
      throw new NotFoundException(`Not found category with name: ${pagination?.name}`);
    }

    return { items, total };
  }

  create = async (data: Partial<Category>): Promise<Category> => {
    const newCategory = await this.categoryRepo.create(data);
    return await this.categoryRepo.save(newCategory);
  }

  update = async (categoryId: number, data: Partial<Category>): Promise<Category> => {
    const category = await this.findByCategoryId(categoryId);

    Object.assign(category, data);
    return await this.categoryRepo.save(category);
  }

  isCategoryActive = async (categoryId: number): Promise<Category> => {
    const category = await this.findByCategoryId(categoryId);

    Object.assign(category, { isActive: !category.isActive});
    return await this.categoryRepo.save(category);
  }

  delete = async (categoryId: number): Promise<string> => {
    const result = await this.categoryRepo.softDelete(categoryId);

    if(result.affected === 0) {
      throw new NotFoundException(`Not found category with id: ${categoryId} in system. `);
    }

    return `Delete category with id ${categoryId} successfully.`;
  }
}