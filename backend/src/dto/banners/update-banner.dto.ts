import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class UpdateBannerDto {
  @IsNotEmpty()
  @IsString()
  title?: string;

  @IsNotEmpty()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsString()
  imageUrl?: string;
  
  @IsNotEmpty()
  @IsDate()
  startDate?: Date;

  @IsNotEmpty()
  @IsDate()
  endDate?: Date;
}