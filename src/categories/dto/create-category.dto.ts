import { IsMongoId, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsMongoId()
  created_by: string;
}
