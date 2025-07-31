import { logger } from "@/config/logger";
import { CreateBrandDto } from "@/dto/brands/create-brand.dto";
import { UpdateBrandDto } from "@/dto/brands/update-brand.dto";
import { PaginationDto } from "@/dto/pagination/pagination.dto";
import { ICustomRequest } from "@/interfaces/request.interface";
import { BrandService } from "@/services/brands.service";
import { ResponseUtil } from "@/utils/response.util";
import { validateDto } from "@/utils/validation";
import { NextFunction, Response } from "express";

export class BrandController {
  private brandService: BrandService;
  constructor() {
    this.brandService = new BrandService();
  }

  findAll = async (req: ICustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const pagination = await validateDto(PaginationDto, req.query);
      const { page = 1, limit = 5 } = pagination || {};
      const response = await this.brandService.findAll(pagination);
      logger.info(`Fetched list brand successfully.`);
      ResponseUtil.paginated(res, response.items, page as number, limit as number, response.total, `Fetched list brand successfully.`); 
    } catch (error) {
      next(error);
    }
  }

  findById = async (req: ICustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = +(req.params.id);
      const response = await this.brandService.findById(id);
      logger.info(`Fetched brand with id ${id} successfully.`);
      ResponseUtil.success(res, response, `Fetched brand with id ${id} successfully.`, 200);
    } catch (error) {
      next(error);
    }
  }

  create = async (req: ICustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = await validateDto(CreateBrandDto, req.body);
      const response = await this.brandService.create(dto);
      logger.info(`Created new brand with id ${response.id} successfully.`);
      ResponseUtil.success(res, response, `Created new brand with id ${response.id} successfully.`, 201);
    } catch (error) {
      next(error);
    }
  }

  update =  async (req: ICustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = +(req.params.id);
      const dto = await validateDto(UpdateBrandDto, req.body);
      const response = await this.brandService.update(id, dto);
      logger.info(`Updated brand with id ${id} successfully.`);
      ResponseUtil.success(res, response, `Updated brand with id ${id} successfully.`, 200);
    } catch (error) {
      next(error);
    }
  }

  delete = async (req: ICustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = +(req.params.id);
      const response = await this.brandService.delete(id);
      logger.info(response);
      ResponseUtil.success(res, null, response, 200);
    } catch (error) {
      next(error);
    }
  } 
}