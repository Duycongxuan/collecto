import { CreateBrandDto } from "@/dto/brands/create-brand.dto";
import { UpdateBrandDto } from "@/dto/brands/update-brand.dto";
import { PaginationDto } from "@/dto/pagination/pagination.dto";
import { Brand } from "@/entities/brands.entity";
import { BrandRepository } from "@/repositories/brands.repository";
import { AppError } from "@/utils/app-error";
import path from "path";
import fs from 'fs';
import cloudinary from "@/config/cloudinary";

const TEMP_UPLOADS_DIR = path.join(__dirname, '../../uploads');

export class BrandService {
  private brandRepo: BrandRepository;
  constructor() {
    this.brandRepo = new BrandRepository();
  }

  findAll = async (pagination?: PaginationDto): Promise<{items: Brand[], total: number}> => {
    return await this.brandRepo.findAll(pagination)
  }

  findById = async (id: number): Promise<Brand> => {
    return await this.brandRepo.findById(id);
  }

  create = async (data: CreateBrandDto): Promise<Brand> => {
    const imgName = data.imageName!;
    const imagePath = path.join(TEMP_UPLOADS_DIR, imgName);
    
    if(!fs.existsSync(imagePath)) {
      throw new AppError('Not found image', 404);
    }
    try {
      const brandExisting = await this.brandRepo.findByName(data.name!);

      if(brandExisting) {
        throw new AppError(`Brand ${data.name!}`, 400);
      }

      const logoUrl = await cloudinary.uploader.upload(imagePath, {
        folder: 'collecto/brands',
        transformation: [{ width: 1920, height: 1080, crop: 'limit', quality: 'auto' }]
      });

      const newBrand: Partial<Brand> = {
        ...data,
        logoUrl: logoUrl.secure_url,
        publicId: logoUrl.public_id
      }

      return await this.brandRepo.create(newBrand);
    } catch (error) {
      throw new AppError('Failed to upload image or create banner', 400)
    } finally {
      fs.promises.unlink(imagePath);
    }
  }

  update = async (id: number, data: UpdateBrandDto): Promise<Brand> => {
    const originalBrand = await this.brandRepo.findById(id);

    const isUnChanged = Object.keys(data).map(
      (key) => data[key as keyof UpdateBrandDto] === originalBrand[key as keyof Brand]
    );

    if(isUnChanged) {
      throw new AppError('Provided data matches current information. No changes were made.', 400)
    }

    return await this.brandRepo.update(id, data);
  }

  delete = async (id: number): Promise<string> => {
    return await this.brandRepo.delete(id); 
  }
}