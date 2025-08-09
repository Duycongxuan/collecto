import { DifficultyLevel, Scale } from "@/enums/enum";
import { IsEnum, IsIn, IsInt, IsNotEmpty, IsNumber, IsString, MinLength } from "class-validator";

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  sku!: string;

  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsNotEmpty()
  @IsString()
  details!: string;

  @IsNotEmpty()
  @IsInt()
  categoryId!: number;

  @IsNotEmpty()
  @IsInt()
  brandId!: number;

  @IsNotEmpty()
  @IsEnum(Scale)
  scale!: string;

  @IsNotEmpty()
  @IsEnum(DifficultyLevel)
  difficultyLevel!: string;

  @IsNotEmpty()
  @IsString()
  material!: string;

  @IsNotEmpty()
  @IsString()
  weight!: string;

  @IsNotEmpty()
  @IsString()
  dimensions!: string;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  originalPrice!: number;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  sellingPrice!: number;

  @IsNotEmpty()
  @IsString()
  ageRating!: string;
}