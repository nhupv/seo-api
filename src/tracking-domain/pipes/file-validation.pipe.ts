import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  transform(
    value: Express.Multer.File,
    metadata: ArgumentMetadata,
  ): Express.Multer.File {
    console.log(value);
    // "value" is an object containing the file's attributes and metadata
    if (!value) {
      throw new BadRequestException('File is required');
    }
    // const maxFileSize = 2e9;
    // if (value.size > maxFileSize) {
    //   throw new BadRequestException('Max file size is 20MB');
    // }
    return value;
  }
}
