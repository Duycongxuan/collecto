import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { PaginationDto } from "../pagination/pagination.dto";

export class SearchCategoryDto extends PaginationDto{
  @IsOptional()
  @IsString()
  name?: string;
}