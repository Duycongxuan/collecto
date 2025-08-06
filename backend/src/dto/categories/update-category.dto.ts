import { IsOptional, IsString, MinLength } from "class-validator";

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  name!: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  description?: string;
}