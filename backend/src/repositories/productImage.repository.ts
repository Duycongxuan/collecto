import { AppDataSource } from "@/config/database";
import { logger } from "@/config/logger";
import { ProductImage } from "@/entities/productImage";
import { NotFoundException } from "@/exceptions/app-error";
import { In, Repository } from "typeorm";

export class ProductImageRepository {
  private readonly productImageRepository: Repository<ProductImage>;

  constructor() {
    this.productImageRepository = AppDataSource.getRepository(ProductImage);
  }

  findAllImages = async (imageIds: number[]): Promise<ProductImage[]> => {
    // Validate input
    if (!imageIds || !Array.isArray(imageIds) || imageIds.length === 0) {
      return [];
    }

    // Fetch images in a single query
    const images = await this.productImageRepository.find({ where: { id: In(imageIds) } });
    
    // Return images in the order of imageIds
    return images;
  };
}