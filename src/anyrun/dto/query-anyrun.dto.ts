import { IsInt, IsISO8601, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryAnyrunDto {
  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number;

  @IsOptional()
  @IsISO8601({ strict: true })
  start_date?: string;

  @IsOptional()
  @IsISO8601({ strict: true })
  end_date?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  size: number;
}
