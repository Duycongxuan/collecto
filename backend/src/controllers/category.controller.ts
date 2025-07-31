import { logger } from "@/config/logger";
import { CreateCategoryDto } from "@/dto/categories/create-category.dto";
import { UpdateCategoryDto } from "@/dto/categories/update-category.dto";
import { PaginationDto } from "@/dto/pagination/pagination.dto";
import { ICustomRequest } from "@/interfaces/request.interface";
import { CategoryService } from "@/services/categories.service";
import { ResponseUtil } from "@/utils/response.util";
import { validateDto } from "@/utils/validation";
import { NextFunction, Response } from "express";

export class CategoryController {
  private categoryService: CategoryService;
  constructor() {
    this.categoryService = new CategoryService();
  }

  findAll = async (req: ICustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const pagination = await validateDto(PaginationDto, req.query);
      const { page = 1, limit = 10 } = req.query || {}; 

      const response = await this.categoryService.findAll(pagination);
      logger.info(`Fetched list categories successfully.`);
      ResponseUtil.paginated(res, response.items, page as number, limit as number, response.total, 'Fetched list categories successfully.')
    } catch (error) {
      next(error);
    }
  }

  findByCategoryId = async (req: ICustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categoryId = +(req.params.id);
      const response = await this.categoryService.findByCategoryId(categoryId);
      logger.info(`Fetched category with id ${ categoryId} successfully.`);
      ResponseUtil.success(res, response, `Fetched category with id ${ categoryId} successfully.`, 200);
    } catch (error) {
      next(error);
    }
  }

  create = async (req: ICustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const newCategory = await validateDto(CreateCategoryDto, req.body);
      const response = await this.categoryService.create(newCategory);
      logger.info(`Created new Category with id ${response.id} successfully.`);
      ResponseUtil.success(res, response, `Create new Category with id ${response.id} successfully.`, 201);
    } catch (error) {
      next(error);
    }
  }

  update = async (req: ICustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categoryId = +(req.params.id);
      const updatedCategory = await validateDto(UpdateCategoryDto, req.body);
      const response = await this.categoryService.update(categoryId, updatedCategory);
      logger.info(`Updated category with id ${categoryId} successfully.`);
      ResponseUtil.success(res, response, `Updated category with id ${categoryId} successfully.`, 200);
    } catch (error) {
      next(error);
    }
  }

  delete = async (req: ICustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categoryId = +(req.params.id);
      const response = await this.categoryService.delete(categoryId);
      logger.info(response);
      ResponseUtil.success(res, null, response, 200);
    } catch (error) {
      next(error);
    }
  }
}