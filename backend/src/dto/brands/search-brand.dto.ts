import { IsOptional, IsString } from "class-validator";
import { PaginationDto } from "../pagination/pagination.dto";

export class SearchBrandDto extends PaginationDto{
  @IsOptional()
  @IsString()
  name?: string;
}