import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAddressDto {
  @IsNotEmpty()
  @IsString()
  recipeName!: string;

  @IsNotEmpty()
  @IsString()
  recipePhone!: string;

  @IsNotEmpty()
  @IsString()
  address!: string;

  @IsNotEmpty()
  @IsString()
  provice!: string;

  @IsNotEmpty()
  @IsString()
  ward!: string;

  @IsOptional()
  isDefault?: boolean;
}