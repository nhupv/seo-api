import { PartialType } from '@nestjs/mapped-types';
import { CreateAnyrunDto } from './create-anyrun.dto';

export class UpdateAnyrunDto extends PartialType(CreateAnyrunDto) {}
