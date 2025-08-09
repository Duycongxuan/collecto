import { IsNotEmpty, IsString } from "class-validator";
import { PaginationDto } from "../pagination/pagination.dto";

export class SearchProductDto extends PaginationDto {
  @IsNotEmpty()
  @IsString()
  name!: string;
}