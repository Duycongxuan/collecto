import { CreateBrandDto } from "@/dto/brands/create-brand.dto";
import { UpdateBrandDto } from "@/dto/brands/update-brand.dto";
import { PaginationDto } from "@/dto/pagination/pagination.dto";
import { Brand } from "@/entities/brands.entity";
import { BrandRepository } from "@/repositories/brands.repository";
import { UploadService } from "./upload.service";
import { BadRequestException } from "@/exceptions/app-error";
import { SearchBrandDto } from "@/dto/brands/search-brand.dto";

export class BrandService {
  constructor(
    private readonly brandRepo: BrandRepository,
    private readonly uploadService: UploadService
  ) {}

  findAllBrands = async (pagination?: PaginationDto): Promise<{items: Brand[], total: number}> => {
    return await this.brandRepo.findAllBrands(pagination)
  }

  findByBrandId = async (id: number): Promise<Brand> => {
    return await this.brandRepo.findByBrandId(id);
  }

  search = async (name: SearchBrandDto): Promise<{ items: Brand[], total: number}> => {
    return await this.brandRepo.search(name);
  }

  create = async (data: CreateBrandDto, image: Express.Multer.File): Promise<Brand> => {
    const { publicId, imageUrl } = await this.uploadService.uploadSingleImage(image, 'brands');
    const newBrand = {
      ...data,
      publicId: publicId,
      logoUrl: imageUrl
    }

    return await this.brandRepo.create(newBrand);
  }

  update = async (brandId: number, data: UpdateBrandDto, image?: Express.Multer.File): Promise<Brand> => {
    const originalBrand = await this.brandRepo.findByBrandId(brandId);

    console.log(`Original Brand: ${originalBrand}`);

    let isUnChanged = Object.keys(data).every(
      key => data[key as keyof UpdateBrandDto] === originalBrand[key as keyof Brand] 
    );

    if(image) {
      isUnChanged = false;
    }

    if(isUnChanged) {
      throw new BadRequestException('Provided data matches current information. No changes were made.');
    }

    let updatedBrand: Partial<Brand> = { ...data };

    if(image) {
      await this.uploadService.deleteImage(originalBrand.publicId!);
      const { publicId, imageUrl } = await this.uploadService.uploadSingleImage(image, 'brands');

      updatedBrand.publicId = publicId;
      updatedBrand.logoUrl = imageUrl;
    }

    console.log(updatedBrand);

    return await this.brandRepo.update(brandId, updatedBrand);
  }

  isActiveBrand = async (brandId: number): Promise<Brand> => {
    return await this.brandRepo.isActiveBrand(brandId);
  }

  delete = async (id: number): Promise<string> => {
    return await this.brandRepo.delete(id); 
  }
}