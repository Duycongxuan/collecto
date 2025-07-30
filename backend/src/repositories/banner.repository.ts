import { PaginationDto } from "../dto/pagination/pagination.dto";
import { AppDataSource } from "../config/database";
import { Banner } from "../entities/banners.entity";
import { FindManyOptions, IsNull, Like, Repository } from "typeorm";
import { AppError } from "../utils/app-error";
import { SearchBannerDto } from "@/dto/banners/search-banner.dto";

export class BannerRepository {
  private bannerRepo: Repository<Banner>
  constructor() {
    this.bannerRepo = AppDataSource.getRepository(Banner);
  }

  findAll = async (data?: PaginationDto): Promise<{ items: Banner[], total: number}> => {
    const { page = 1, limit = 10} = data || {};
    const skip = ( page - 1 )* limit;

    const findOptions: FindManyOptions<Banner> = {
      where: { deletedAt: IsNull() },
      order: { createdAt: 'DESC' },
      skip: skip,
      take: limit
    }
    const [items, total] = await this.bannerRepo.findAndCount(findOptions);
    return {
      items,
      total
    }
  }

  findByBannerId = async (bannerId: number): Promise<Banner> => {
    const banner = await this.bannerRepo.findOne({ where: { id: bannerId, deletedAt: IsNull()}});

    if(!banner){
      throw new AppError('Not found banner in system.', 404);
    }
    return banner;
  }

  searchBanner = async (data?: SearchBannerDto): Promise<{ items: Banner[], total: number}> => {
    const { page = 1, limit = 10, title } = data || {};
    const skip = (page - 1) * limit;

    
    const findOptions: FindManyOptions<Banner> = {
      where: {
        title: Like(`%${data?.title}%`),
        deletedAt: IsNull()
      },
      order: { createdAt: 'DESC' },
      skip: skip,
      take: limit
    }

    const [items, total] = await this.bannerRepo.findAndCount(findOptions);
    return {
      items,
      total
    }
  }

  create = async (data: Partial<Banner>): Promise<Banner> => {
    const newBanner = await this.bannerRepo.create(data);
    return await this.bannerRepo.save(newBanner);
  }

  update = async (bannerId: number, data: Partial<Banner>): Promise<Banner> => {
    const banner = await this.findByBannerId(bannerId);

    Object.assign(banner, data);
    return await this.bannerRepo.save(banner);
  }

  updateStatus = async (bannerId: number): Promise<Banner> => {
    const banner =  await this.findByBannerId(bannerId);
    Object.assign(banner, { isActive: ! banner.isActive });
    return await this.bannerRepo.save(banner);
  }

  delete = async (bannerId: number): Promise<string> => {
    const result = await this.bannerRepo.softDelete(bannerId);
    if(result.affected === 0) {
      throw new AppError('Not found banner in system', 404);
    }

    return `Delete banner with id: ${ bannerId} successfully.`;
  }
}