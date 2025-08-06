import { CreateCategoryDto } from "@/dto/categories/create-category.dto";
import { SearchCategoryDto } from "@/dto/categories/search-category.dto";
import { UpdateCategoryDto } from "@/dto/categories/update-category.dto";
import { PaginationDto } from "@/dto/pagination/pagination.dto";
import { Category } from "@/entities/categories.entity";

export interface ICategoryService {
  findAllCategories(pagination?: PaginationDto): Promise<{items: Category[], total: number}>;
  findByCategoryId(categoryId: number): Promise<Category>;
  search(pagination?: SearchCategoryDto): Promise<{items: Category[], total: number}>;
  create(data: CreateCategoryDto): Promise<Category>;
  update(categoryId: number, data: UpdateCategoryDto): Promise<Category>;
  isActiveCategory(categoryId: number): Promise<Category>;
  delete(categoryId: number): Promise<string>;
}