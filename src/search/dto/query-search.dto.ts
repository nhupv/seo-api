import { Type } from 'class-transformer';
import {
  IsInt,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
export class QuerySearch {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(500)
  search: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page: number;

  @IsOptional()
  @IsISO8601({ strict: true })
  start_date: string;

  @IsOptional()
  @IsISO8601({ strict: true })
  end_date: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  size: number;
}
