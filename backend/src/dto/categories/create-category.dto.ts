import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  name!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  description?: string;
}