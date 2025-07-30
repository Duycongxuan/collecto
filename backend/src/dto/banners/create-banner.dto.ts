import { AppError } from "@/utils/app-error";
import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class CreateBannerDto {
  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsNotEmpty()
  @IsString()
  filename!: string;
  
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  startDate!: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  validateDates() {
    if (this.endDate && this.startDate > this.endDate) {
      throw new AppError('startDate must be before or equal to endDate', 400);
    }
  }
}