import { Banner } from "../entities/banners.entity";
import { PaginationDto } from "../dto/pagination/pagination.dto";
import { BannerRepository } from "../repositories/banner.repository";
import fs from 'fs';
import path from "path";
import cloudinary from "../config/cloudinary";
import { AppError } from "../utils/app-error";
import { SearchBannerDto } from "../dto/banners/search-banner.dto";
import { CreateBannerDto } from "@/dto/banners/create-banner.dto";
import { UpdateBannerDto } from "@/dto/banners/update-banner.dto";

const TEMP_UPLOADS_DIR = path.join(__dirname, '../../uploads');

export class BannerService {
  private bannerRepo: BannerRepository;
  constructor() {
    this.bannerRepo = new BannerRepository();
  }

  findAll = async (data?: PaginationDto): Promise<{ items: Banner[], total: number }> => {
    return await this.bannerRepo.findAll(data);
  }

  findByBannerId = async (bannerId: number): Promise<Banner> => {
    return await this.bannerRepo.findByBannerId(bannerId);
  }

  search = async (data?: SearchBannerDto): Promise<{items: Banner[], total: number}> => {
    return await this.bannerRepo.searchBanner(data);
  }

  create = async (data: CreateBannerDto): Promise<Banner> => {
    const filename = data.filename!;
    const imgPath = path.join(TEMP_UPLOADS_DIR, filename);

    if (!fs.existsSync(imgPath)) {
      throw new AppError('Not found image', 404);
    }

    try {
      const uploadedImage = await cloudinary.uploader.upload(imgPath, {
        folder: 'collecto/banners',
        transformation: [{ width: 1920, height: 1080, crop: 'limit', quality: 'auto' }]
      });

      const newBanner: Partial<Banner> = {
        ...data,
        imageUrl: uploadedImage.secure_url,
        publicId: uploadedImage.public_id
      };

      const createdBanner = await this.bannerRepo.create(newBanner);
      return createdBanner;
    } catch (error) {
      throw new AppError('Failed to upload image or create banner', 400);
    } finally {
      await fs.promises.unlink(imgPath);
    }
  };

  update = async (bannerId: number, data: UpdateBannerDto): Promise<Banner> => {
    const originalBanner = await this.bannerRepo.findByBannerId(bannerId);

    const isUnChanged = Object.keys(data).every(
      (key) => data[key as keyof UpdateBannerDto] === originalBanner[key as keyof Banner]
    );

    if(isUnChanged) {
      throw new AppError('Provided data matches current information. No changes were made.', 400)
    }

    return await this.bannerRepo.update(bannerId, data);
  }

  updateStatus = async (bannerId: number): Promise<Banner> => {
    return await this.bannerRepo.updateStatus(bannerId);
  }

  delete = async (bannerId: number): Promise<string> => {
    return await this.bannerRepo.delete(bannerId);
  }
}