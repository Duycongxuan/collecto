import { DifficultyLevel, Scale } from "@/enums/enum";
import { IsEnum, IsInt, IsOptional, IsNumber, IsString, IsArray } from "class-validator";

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  details?: string;

  @IsOptional()
  @IsInt()
  categoryId?: number;

  @IsOptional()
  @IsInt()
  brandId?: number;

  @IsOptional()
  @IsEnum(Scale)
  scale?: string;

  @IsOptional()
  @IsEnum(DifficultyLevel)
  difficultyLevel?: string;

  @IsOptional()
  @IsString()
  material?: string;

  @IsOptional()
  @IsString()
  weight?: string;

  @IsOptional()
  @IsString()
  dimensions?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  originalPrice?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  sellingPrice?: number;

  @IsOptional()
  @IsString()
  ageRating?: string; 

  @IsOptional()
  @IsArray()
  imageIds?: number[];
}