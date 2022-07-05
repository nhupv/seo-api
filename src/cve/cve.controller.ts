import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { PostsService } from 'src/posts/posts.service';
import { CveService } from './cve.service';
import { QueryListCVE } from './dto/query-list-cve.dto';

@Controller('cve')
export class CveController {
  constructor(
    private readonly cveService: CveService,
    private readonly postNews: PostsService,
  ) {}

  @Get('list')
  async getCve(@Query() query: QueryListCVE, @Res() res: Response) {
    try {
      const { total, data } = await this.cveService.getList(query);
      res.status(HttpStatus.OK).json({ total, data });
    } catch (error) {
      // console.log(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ status: false });
    }
  }

  @Get('statistics')
  async getTotal(@Res() res: Response) {
    try {
      const data = await this.cveService.getStatistics();
      res.status(HttpStatus.OK).json({ data });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ status: false });
    }
  }

  @Get('latest')
  async getLatestCve(@Res() res: Response) {
    try {
      const { data } = await this.cveService.search();
      res.status(HttpStatus.OK).json({ data });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ status: false });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const cve = await this.cveService.findOne(id);
    if (!cve) {
      throw new NotFoundException(`Cve with id ${id} was not found!`);
    }
    const { data } = await this.postNews.getPostCve({
      search: cve.name,
      size: 10,
    });
    return { detail: cve, references: data };
  }
}
