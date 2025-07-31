import { CreateCategoryDto } from "@/dto/categories/create-category.dto";
import { UpdateCategoryDto } from "@/dto/categories/update-category.dto";
import { PaginationDto } from "@/dto/pagination/pagination.dto";
import { Category } from "@/entities/categories.entity";
import { CategoryRepository } from "@/repositories/categories.repository";
import { AppError } from "@/utils/app-error";

export class CategoryService {
  private categoryRepo: CategoryRepository;
  constructor() {
    this.categoryRepo = new CategoryRepository();
  }

  findAll = async (pagination?: PaginationDto): Promise<{items: Category[], total: number}> => {
    return await this.categoryRepo.findAll(pagination);
  }

  findByCategoryId = async (categoryId: number): Promise<Category> => {
    return await this.categoryRepo.findByCategoryId(categoryId);
  }

  create = async (data: CreateCategoryDto): Promise<Category> => {
    return await this.categoryRepo.create(data);
  }

  update = async (categoryId: number, data: UpdateCategoryDto): Promise<Category> => {
    const originalCategory = await this.categoryRepo.findByCategoryId(categoryId);

    const isUnChanged = Object.keys(data).map( key => 
      data[key as keyof UpdateCategoryDto] === originalCategory[key as keyof Category]
    );

    if(isUnChanged) {
      throw new AppError('Provided data matches current information. No changes were made.', 400)
    }

    return await this.categoryRepo.update(categoryId, data);
  }

  delete = async (categoryId: number): Promise<string> => {
    return await this.categoryRepo.delete(categoryId);
  }
}