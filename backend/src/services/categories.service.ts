import { CreateCategoryDto } from "@/dto/categories/create-category.dto";
import { SearchCategoryDto } from "@/dto/categories/search-category.dto";
import { UpdateCategoryDto } from "@/dto/categories/update-category.dto";
import { PaginationDto } from "@/dto/pagination/pagination.dto";
import { Category } from "@/entities/categories.entity";
import { BadRequestException } from "@/exceptions/app-error";
import { ICategoryService } from "@/interfaces/services/category.interface";
import { CategoryRepository } from "@/repositories/categories.repository";

export class CategoryService implements ICategoryService{
  constructor(
    private readonly categoryRepo: CategoryRepository
  ) {}

  findAllCategories = async (pagination?: PaginationDto): Promise<{items: Category[], total: number}> => {
    return await this.categoryRepo.findAllCategories(pagination);
  }

  findByCategoryId = async (categoryId: number): Promise<Category> => {
    return await this.categoryRepo.findByCategoryId(categoryId);
  }

  search = async (pagination?: SearchCategoryDto): Promise<{items: Category[], total: number}> => {
    return await this.categoryRepo.search(pagination);
  }

  create = async (data: CreateCategoryDto): Promise<Category> => {
    return await this.categoryRepo.create(data);
  }

  update = async (categoryId: number, data: UpdateCategoryDto): Promise<Category> => {
    const originalCategory = await this.categoryRepo.findByCategoryId(categoryId);

    const isUnChanged = Object.keys(data).every( key => 
      data[key as keyof UpdateCategoryDto] === originalCategory[key as keyof Category]
    );

    if(isUnChanged) {
      throw new BadRequestException('Provided data matches current information. No changes were made.');
    }

    return await this.categoryRepo.update(categoryId, data);
  }

  isActiveCategory = async (categoryId: number): Promise<Category> => {
    return await this.categoryRepo.isCategoryActive(categoryId);
  }

  delete = async (categoryId: number): Promise<string> => {
    return await this.categoryRepo.delete(categoryId);
  }
}