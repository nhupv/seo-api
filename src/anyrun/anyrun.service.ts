import { Injectable } from '@nestjs/common';
import { CreateAnyrunDto } from './dto/create-anyrun.dto';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { AnyrunResult } from './interfaces/anyrun-result.interface';
import { Anyrun, ANYRUN_INDEX } from './interfaces/anyrun.interface';
import { QueryAnyrunDto } from './dto/query-anyrun.dto';

@Injectable()
export class AnyrunService {
  constructor(private readonly elasticSearchService: ElasticsearchService) {}

  create(createAnyrunDto: CreateAnyrunDto) {
    return 'This action adds a new anyrun';
  }

  async findAll(queryAnyRunDto: QueryAnyrunDto) {
    const { page } = queryAnyRunDto;
    const paramQuery = this.buildParam(queryAnyRunDto);
    const { body } = await this.elasticSearchService.search<AnyrunResult>({
      index: ANYRUN_INDEX,
      body: paramQuery,
      size: +process.env.ELASTIC_SIZE_DEFAULT,
      from: page * +process.env.ELASTIC_SIZE_DEFAULT || 0,
    });
    const { total, hits } = body.hits;
    const data = hits.map((item) => ({ id: item._id, ...item._source }));
    return { total, data };
  }

  buildParam(query) {
    const { search, start_date, end_date } = query;
    const must = [];
    if (start_date && end_date) {
      must.push({
        range: {
          date: {
            gte: start_date,
            lte: end_date,
            format: 'yyyy-MM-dd HH:mm:ss||yyyy-MM-dd',
            time_zone: '+07:00',
          },
        },
      });
    }
    if (search) {
      must.push({
        multi_match: {
          query: search,
          fields: ['title'],
          type: 'phrase_prefix',
        },
      });
    }
    return {
      query: {
        bool: {
          must: must,
        },
      },
    };
  }

  async findOne(id: string): Promise<Anyrun> {
    const paramQuery = {
      query: {
        match: {
          _id: id,
        },
      },
    };
    const { body } = await this.elasticSearchService.search<AnyrunResult>({
      index: ANYRUN_INDEX,
      body: paramQuery,
    });
    const { total, hits } = body.hits;
    const data = hits.map((item) => item._source);
    return data[0];
  }
}
