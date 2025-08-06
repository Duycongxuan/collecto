import { SearchCategoryDto } from "@/dto/categories/search-category.dto";
import { PaginationDto } from "@/dto/pagination/pagination.dto";
import { Category } from "@/entities/categories.entity";

export interface ICategoryRepository {
  findAllCategories(pagination?: PaginationDto): Promise<{items: Category[], total: number}>;
  findByCategoryId(categoryId: number): Promise<Category>;
  search(pagination?: SearchCategoryDto): Promise<{items: Category[], total: number}>;
  create(data: Partial<Category>): Promise<Category>;
  isCategoryActive(categoryId: number): Promise<Category>;
  update(categoryId: number, data: Partial<Category>): Promise<Category>;
  delete(categoryId: number): Promise<string>;
}