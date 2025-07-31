import { IsNotEmpty, IsString, IsUrl, MinLength } from "class-validator";

export class CreateBrandDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  name?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  description?: string;

  @IsNotEmpty()
  @IsString()
  imageName?: string;

  @IsNotEmpty()
  @IsUrl()
  website?: string;

  @IsNotEmpty()
  @IsString()
  country?: string;
}