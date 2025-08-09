import { HTTP_STATUS_CODE } from "@/constants";
import { PaginationDto } from "@/dto/pagination/pagination.dto";
import { CreateProductDto } from "@/dto/products/create-product.dto";
import { SearchProductDto } from "@/dto/products/search-product.dto";
import { UpdateProductDto } from "@/dto/products/update-product.dto";
import { IRequest } from "@/interfaces/request.interface";
import { ProductService } from "@/services/products.service";
import { ApiResponse } from "@/utils/response.util";
import { NextFunction, Response } from "express";
import fs from 'fs';

export class ProductController {
  constructor(
    private readonly productService: ProductService
  ) {}

  findByProductId = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = +(req.params.id);
      const respone = await this.productService.findByProductId(id);
      ApiResponse.success(res, respone, `Fetched product with id ${id} successfully.`, HTTP_STATUS_CODE.OK);
    } catch (error) {
      next(error);
    }
  }

  findAllProducts = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const respone = await this.productService.findAllProducts({ page, limit} as PaginationDto);
      ApiResponse.paginated(res, respone.items, page, limit, respone.total, `Fetched list products successfully.`)
    } catch (error) {
      next(error);
    }
  }

  search = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const { name } = req.body;

      const respone = await this.productService.search({ page, limit, name} as SearchProductDto);
      ApiResponse.paginated(res, respone.items, page, limit, respone.total, `Fetched list products with name: ${name} successfully.`)
    } catch (error) {
      next(error);
    }
  }

  create = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
    const images = req.files as Express.Multer.File[] || [];
    try {
      const response = await this.productService.create(req.body as CreateProductDto, images);
      ApiResponse.success(res, response, `Create new product with id: ${response.id} successfully.`, HTTP_STATUS_CODE.CREATED_SUCCESSFUL);
    } catch (error) {
      next(error);
    } finally {
      if(images && images.length > 0) {
        images.forEach((image) => {
          fs.unlinkSync(image.path);
        });
      }
    }
  }

  update = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
    const images = req.files as Express.Multer.File[] || [];
    try {
      const productId = +(req.params.id);
      const {imageIds, ...productInfo} = req.body as UpdateProductDto;
      // imageIds?.map(imageId => Number(imageId));
      const response = await this.productService.update(productId, productInfo, imageIds, images);
      ApiResponse.success(res, response, `Updated product with id: ${productId} successfully.`, HTTP_STATUS_CODE.OK);
    } catch (error) {
      next(error);
    } finally {
      if(images && images.length > 0) {
        images.forEach((image) => {
          fs.unlinkSync(image.path);
        });
      }
    }
  }

  isActiveProduct = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = +(req.params.id);
      const product = await this.productService.isActiveProduct(id);
      ApiResponse.success(res, product, `Update status product with id: ${id} successdully.`, HTTP_STATUS_CODE.OK);
    } catch (error) {
      next(error);
    }
  }

  delete = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = +(req.params.id);
      const message = await this.productService.delete(id);
      ApiResponse.success(res, null, message, HTTP_STATUS_CODE.OK);
    } catch (error) {
      next(error);
    }
  }
}