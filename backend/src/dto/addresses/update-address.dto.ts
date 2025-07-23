import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateAddressDto {
  @IsOptional()
  @IsString()
  recipeName?: string;

  @IsOptional()
  @IsString()
  recipePhone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  provice?: string;

  @IsOptional()
  @IsString()
  ward?: string;
}