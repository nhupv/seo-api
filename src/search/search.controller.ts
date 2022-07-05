import { Controller, HttpStatus, Res, Query, Get } from '@nestjs/common';
import { SearchService } from './search.service';
import { Response } from 'express';
import { QuerySearch } from './dto/query-search.dto';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async search(@Res() res: Response, @Query() query: QuerySearch) {
    const data = await this.searchService.searchAll(query);
    res.status(HttpStatus.OK).json({ data });
  }

  @Get('more')
  async searchMore(@Res() res: Response, @Query() query: QuerySearch) {
    const data = await this.searchService.searchSeflAll(query);
    res.status(HttpStatus.OK).json({ data });
  }
}
