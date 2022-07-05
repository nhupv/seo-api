import {
  IsArray,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class QueryListCVE {
  @IsOptional()
  @IsISO8601({ strict: true })
  start_date: string;

  @IsOptional()
  @IsISO8601({ strict: true })
  end_date: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page: number;

  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  @IsArray()
  status: string[];
}
