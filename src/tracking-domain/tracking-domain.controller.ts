import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Request,
  Query,
  UploadedFile,
  UsePipes,
  BadRequestException,
} from '@nestjs/common';
import { TrackingDomainService } from './tracking-domain.service';
import { CreateTrackingDomainDto } from './dto/create-tracking-domain.dto';
import { UpdateTrackingDomainDto } from './dto/update-tracking-domain.dto';
import { ObjectId } from 'mongoose';
import { PaginationInterceptor } from '../pagination/interceptor/pagination.interceptor';
import { PaginationParams } from '../pagination/dto/papgination-params.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream } from 'fs';
import { join } from 'path';
import { CsvParser } from 'nest-csv-parser';
import { FileValidationPipe } from './pipes/file-validation.pipe';
import { diskStorage } from 'multer';
import { fileFilter } from '../helpers/file-helpers';

@UseInterceptors(PaginationInterceptor)
@Controller('tracking-domains')
export class TrackingDomainController {
  constructor(
    private readonly trackingDomainService: TrackingDomainService,
    private readonly csvParser: CsvParser,
  ) {}

  @Post()
  create(@Body() createTrackingDomainDto: CreateTrackingDomainDto) {
    return this.trackingDomainService.create(createTrackingDomainDto);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
      }),
      fileFilter: fileFilter,
      limits: { fileSize: 10485760 },
    }),
  )
  async createBulk(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    const fileStream = createReadStream(join(process.cwd(), file.path));

    const entities = await this.csvParser.parse(
      fileStream,
      CreateTrackingDomainDto,
      null,
      null,
      { strict: true, separator: ',' },
    );
    return this.trackingDomainService.createBulk(entities.list);
  }

  @Get()
  findAll(
    @Request() req,
    @Query() { perPage, sortBy, sortType }: PaginationParams,
  ) {
    return this.trackingDomainService.findAll(
      req.query.skip,
      perPage,
      sortBy,
      sortType,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: ObjectId) {
    return this.trackingDomainService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: ObjectId,
    @Body() updateTrackingDomainDto: UpdateTrackingDomainDto,
  ) {
    return this.trackingDomainService.update(id, updateTrackingDomainDto);
  }

  @Delete(':id')
  remove(@Param('id') id: ObjectId) {
    return this.trackingDomainService.remove(id);
  }
}
