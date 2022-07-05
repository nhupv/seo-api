import {
  Controller,
  Get,
  Param,
  NotFoundException,
  Query,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { AnyrunService } from './anyrun.service';
import { QueryAnyrunDto } from './dto/query-anyrun.dto';
import { Response } from 'express';

@Controller('any-run')
export class AnyrunController {
  constructor(private readonly anyrunService: AnyrunService) {}

  @Get()
  async findAll(@Query() query: QueryAnyrunDto, @Res() res: Response) {
    try {
      const { total, data } = await this.anyrunService.findAll(query);
      res.status(HttpStatus.OK).json({ total, data });
    } catch (error) {
      console.log(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ status: false });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const anyRun = await this.anyrunService.findOne(id);
    if (!anyRun) {
      throw new NotFoundException('Anyrun with id ${id} was not found!');
    }
    return anyRun;
  }
}
