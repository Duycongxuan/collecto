import { AppDataSource } from "@/config/database";
import { PaginationDto } from "@/dto/pagination/pagination.dto";
import { Category } from "@/entities/categories.entity";
import { AppError } from "@/utils/app-error";
import { FindManyOptions, IsNull, Repository } from "typeorm";

export class CategoryRepository {
  private CategoryRepo: Repository<Category>;
  constructor() {
    this.CategoryRepo = AppDataSource.getRepository(Category);
  }

  findAll = async (pagination?: PaginationDto): Promise<{ items: Category[], total: number}> => {
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

    const [items, total ]= await this.CategoryRepo.findAndCount(findOptions);
    return { items, total }
  }

  findByCategoryId = async (categoryId: number): Promise<Category> => {
    const category = await this.CategoryRepo.findOne({ where: { id: categoryId, deletedAt: IsNull() } });

    if(!category) {
      throw new AppError('Not found category', 404);
    }

    return category;
  }

  create = async (data: Partial<Category>): Promise<Category> => {
    const newCategory = await this.CategoryRepo.create(data);
    return await this.CategoryRepo.save(newCategory);
  }

  update = async (categoryId: number, data: Partial<Category>): Promise<Category> => {
    const category = await this.findByCategoryId(categoryId);

    Object.assign(category, data);
    return await this.CategoryRepo.save(category);
  }

  delete = async (categoryId: number): Promise<string> => {
    const result = await this.CategoryRepo.softDelete(categoryId);

    if(result.affected === 0) {
      throw new AppError('Not found category', 404);
    }

    return `Delete category with id ${categoryId} successfully.`;
  }
}