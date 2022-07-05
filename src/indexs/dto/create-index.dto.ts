import { IsMongoId, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';
export class CreateIndexDto {
  @IsString()
  name: string;

  @IsString()
  search_field: string;

  @IsString()
  path: string;

  @IsString()
  title: string;

  @IsMongoId()
  created_by: ObjectId;
}
