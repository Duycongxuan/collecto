import { IsOptional, IsString } from "class-validator";
import { PaginationDto } from "../pagination/pagination.dto";

export class SearchBannerDto extends PaginationDto {
  @IsOptional()
  @IsString()
  title?: string;
}