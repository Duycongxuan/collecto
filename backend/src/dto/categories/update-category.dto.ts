import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class UpdateCategoryDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  name!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  description?: string;
}