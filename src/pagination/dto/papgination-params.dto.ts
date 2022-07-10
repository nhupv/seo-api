import { IsOptional, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationParams {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(2)
  perPage?: number;

  @IsOptional()
  @Type(() => String)
  sortBy?: string;

  @IsOptional()
  @Type(() => String)
  sortType?: string;
}
