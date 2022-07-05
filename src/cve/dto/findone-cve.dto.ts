import { IsString } from 'class-validator';

export class FindOneCve {
  @IsString()
  id: string;
}
