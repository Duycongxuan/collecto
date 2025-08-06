import { HTTP_STATUS_CODE } from "@/constants";
import { CreateBrandDto } from "@/dto/brands/create-brand.dto";
import { SearchBrandDto } from "@/dto/brands/search-brand.dto";
import { UpdateBrandDto } from "@/dto/brands/update-brand.dto";
import { PaginationDto } from "@/dto/pagination/pagination.dto";
import { IRequest } from "@/interfaces/request.interface";
import { BrandService } from "@/services/brands.service";
import { ApiResponse } from "@/utils/response.util";
import { NextFunction, Response } from "express";
import path from "path";
import fs from 'fs';

const TEMP_PATH = path.join(__dirname, '../../uploads');

export class BrandController {
  constructor(
    private readonly brandService: BrandService
  ) {}

  findAllBrands = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const response = await this.brandService.findAllBrands({ page, limit} as PaginationDto);
      ApiResponse.paginated(res, response.items, page as number, limit as number, response.total, `Fetched list brand successfully.`); 
    } catch (error) {
      next(error);
    }
  }

  findById = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = +(req.params.id);
      const response = await this.brandService.findByBrandId(id);
      ApiResponse.success(res, response, `Fetched brand with id ${id} successfully.`, HTTP_STATUS_CODE.OK);
    } catch (error) {
      next(error);
    }
  }

  search = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const name = req.query.name;

      const response = await this.brandService.search({page, limit, name} as SearchBrandDto);
      ApiResponse.paginated(res, response.items, page, limit, response.total, `Fetched list brands with name: ${name} sunccessfully.`);
    } catch (error) {
      next(error);
    }
  }

  create = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
    const image = req.file as Express.Multer.File;
    try {
      const response = await this.brandService.create(req.body, image);
      ApiResponse.success(res, response, `Created new brand with id ${response.id} successfully.`, HTTP_STATUS_CODE.CREATED_SUCCESSFUL);
    } catch (error) {
      next(error);
    } finally {
      fs.unlinkSync(image.path);
    }
  }

  update =  async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = +(req.params.id);
      const response = await this.brandService.update(id, req.body as UpdateBrandDto, req.file as Express.Multer.File);
      ApiResponse.success(res, response, `Updated brand with id ${id} successfully.`, HTTP_STATUS_CODE.OK);
    } catch (error) {
      next(error);
    }
  }

  isActiveBrand = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = +(req.params.id);
      const response = await this.brandService.isActiveBrand(id);
      ApiResponse.success(res, response, `Update status brand with id: ${id} successfully.`, HTTP_STATUS_CODE.OK);
    } catch (error) {
      next(error);
    }
  }

  delete = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = +(req.params.id);
      const response = await this.brandService.delete(id);
      ApiResponse.success(res, null, response, HTTP_STATUS_CODE.OK);
    } catch (error) {
      next(error);
    }
  } 
}