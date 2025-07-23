import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PaginationDto {
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  @Min(1)
  page: number = 1;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(100)
  limit: number = 5;

  get skip(): number{
    return (this.page - 1) * this.limit;
  }
}