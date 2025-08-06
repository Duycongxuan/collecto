import { logger } from "@/config/logger";
import { HTTP_STATUS_CODE } from "@/constants";
import { CreateCategoryDto } from "@/dto/categories/create-category.dto";
import { SearchCategoryDto } from "@/dto/categories/search-category.dto";
import { UpdateCategoryDto } from "@/dto/categories/update-category.dto";
import { IRequest } from "@/interfaces/request.interface";
import { CategoryService } from "@/services/categories.service";
import { ApiResponse } from "@/utils/response.util";
import { NextFunction, Response } from "express";

export class CategoryController {
  constructor(
    private categoryService: CategoryService
  ) {}

  findAllCategories = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const response = await this.categoryService.findAllCategories({ page, limit });
      ApiResponse.paginated(res, response.items, page, limit, response.total, 'Fetched list categories successfully.');
    } catch (error) {
      next(error);
    }
  }

  findByCategoryId = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categoryId = +(req.params.id);
      const response = await this.categoryService.findByCategoryId(categoryId);
      logger.info(`Fetched category with id ${ categoryId} successfully.`);
      ApiResponse.success(res, response, `Fetched category with id ${ categoryId} successfully.`, HTTP_STATUS_CODE.OK);
    } catch (error) {
      next(error);
    }
  }

  search = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const { name } = req.body;
      console.log(`category name: ${name}`)
      const response = await this.categoryService.search({ page, limit, name } as SearchCategoryDto);
      ApiResponse.paginated(res, response.items, page, limit, response.total, 'Fetched list categories successfully.');
    } catch (error) {
      next(error);
    }
  }

  create = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await this.categoryService.create(req.body as CreateCategoryDto);
      ApiResponse.success(res, response, `Create new Category with id ${response.id} successfully.`, 201);
    } catch (error) {
      next(error);
    }
  }

  update = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categoryId = +(req.params.id);
      const response = await this.categoryService.update(categoryId, req.body as UpdateCategoryDto);
      ApiResponse.success(res, response, `Updated category with id ${categoryId} successfully.`, 200);
    } catch (error) {
      next(error);
    }
  }

  isActiveCategory = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categoryId = +(req.params.id);
      const response = await this.categoryService.isActiveCategory(categoryId);
      ApiResponse.success(res, response, `Update category status with id: ${categoryId} successfully.`, HTTP_STATUS_CODE.OK);
    } catch (error) {
      next(error);
    }
  }

  delete = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categoryId = +(req.params.id);
      const response = await this.categoryService.delete(categoryId);
      ApiResponse.success(res, null, response, 200);
    } catch (error) {
      next(error);
    }
  }
}