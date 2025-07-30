import { logger } from "@/config/logger";
import { CreateBannerDto } from "@/dto/banners/create-banner.dto";
import { SearchBannerDto } from "@/dto/banners/search-banner.dto";
import { UpdateBannerDto } from "@/dto/banners/update-banner.dto";
import { PaginationDto } from "@/dto/pagination/pagination.dto";
import { ICustomRequest } from "@/interfaces/request.interface";
import { BannerService } from "@/services/banner.service";
import { ResponseUtil } from "@/utils/response.util";
import { validateDto } from "@/utils/validation";
import { Response, NextFunction } from "express";

export class BannerController {
  private bannerService: BannerService;
  constructor() {
    this.bannerService = new BannerService();
  } 

  fillAll = async (req: ICustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const pagination = await validateDto(PaginationDto, req.query);
      const result =  await this.bannerService.findAll(pagination);
      logger.info('Fetched list banners successfully.');
      ResponseUtil.paginated(res, result.items, pagination.page!, pagination.limit!, result.total, 'Fetched list banners successfully.');
    } catch (error) {
      next(error);
    }
  }

  findByBannerId = async (req: ICustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const bannerId = +(req.params.id);
      const banner = await this.bannerService.findByBannerId(bannerId);
      logger.info(`Fetched banner with id ${bannerId} successfully.`);
      ResponseUtil.success(res, banner, `Fetched banner with id ${bannerId} successfully.`, 200);
    } catch (error) {
      next(error)
    }
  }

  search = async (req: ICustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const pagination = await validateDto(SearchBannerDto, req.query);
      const result = await this.bannerService.search(pagination);
      logger.info(`Search list bannner with title is ${req.query?.title} successfully.`);
      ResponseUtil.paginated(res, result.items, pagination.page!, pagination.limit!, result.total, 'Fetched list banners successfully.');
    } catch (error) {
      next(error);
    }
  }

  create = async (req: ICustomRequest, res: Response, next: NextFunction) => {
    try {
      const dto = await validateDto(CreateBannerDto, req.body);
      const newBanner = await this.bannerService.create(dto);
      logger.info(`Create new banner with id ${newBanner.id} successfully.`);
      ResponseUtil.success(res, newBanner, `Create new banner with id ${newBanner.id} successfully.`, 201);
    } catch (error) {
      next(error);
    }
  }

  update = async (req: ICustomRequest, res: Response, next: NextFunction) => {
    try {
      const dto = await validateDto(UpdateBannerDto, req.body);
      const updatedBanner = await this.bannerService.update(+(req.params.id), dto);
      logger.info(`Update banner with id ${updatedBanner.id} successfully.`);
      ResponseUtil.success(res, updatedBanner, `Update banner with id ${updatedBanner.id} successfully.`, 200);
    } catch (error) {
      next(error);
    }
  }

  updateStatus = async (req: ICustomRequest, res: Response, next: NextFunction) => {
    try {
      const updatedBanner = await this.bannerService.updateStatus(+(req.params.id));
      logger.info(`Update status banner with id ${updatedBanner.id} successfully.`);
      ResponseUtil.success(res, updatedBanner, `Update status banner with id ${updatedBanner.id} successfully.`, 200);
    } catch (error) {
      next(error);
    }
  }

  delete = async (req: ICustomRequest, res: Response, next: NextFunction) => {
    try {
      const deletedBanner = await this.bannerService.delete(+(req.params.id));
      logger.info(`Delete banner with id ${+(req.params.id)} successfully.`);
      ResponseUtil.success(res, null, `Delete banner with id ${+(req.params.id)} successfully.`, 200);
    } catch (error) {
      next(error);
    }
  }
}