import { Inject, Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Cve, CVE_INDEX } from './interfaces/cve.interface';
import { CveResult } from './interfaces/cve-result.interface';
import * as moment from 'moment-timezone';

@Injectable()
export class CveService {
  constructor(
    private readonly elasticSearchService: ElasticsearchService,
    @Inject('Moment') private momentService: moment.Moment,
  ) {}

  async search() {
    const { body } = await this.elasticSearchService.search<CveResult>({
      index: CVE_INDEX,
      body: {
        sort: [
          {
            date: {
              order: 'desc',
            },
          },
          '_score',
        ],
      },
      size: 6,
    });
    const { total, hits } = body.hits;
    const data = hits.map((item) => item._source);
    return { total, data };
  }

  async searchForAll() {
    const { total, data } = await this.search();
    return {
      title: 'CVE',
      path: '/cve',
      total: total,
      data: data,
    };
  }

  async getList(query) {
    const { search, start_date, end_date, page, status } = query;
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
          fields: ['name', 'description'],
          type: 'phrase_prefix',
        },
      });
    }
    if (status && status.length > 0) {
      const queryStatus = status.map((stt) => ({
        wildcard: { status: stt },
      }));
      must.push({
        bool: {
          should: queryStatus,
        },
      });
    }
    const { body } = await this.elasticSearchService.search<any>({
      index: CVE_INDEX,
      body: {
        query: {
          bool: {
            must: must,
          },
        },
        sort: [
          {
            date: {
              order: 'desc',
            },
          },
          '_score',
        ],
      },
      size: Number(process.env.ELASTIC_SIZE_DEFAULT),
      from: page * Number(process.env.ELASTIC_SIZE_DEFAULT) || 0,
    });
    const { total, hits } = body.hits;
    const data = hits.map(({ _id, _source }) => ({ id: _id, ..._source }));
    return { total, data };
  }

  async findOne(id: string): Promise<Cve> {
    const paramQuery = {
      query: {
        match: {
          _id: id,
        },
      },
    };
    const { body } = await this.elasticSearchService.search<CveResult>({
      index: CVE_INDEX,
      body: paramQuery,
    });
    const { total, hits } = body.hits;
    const data = hits.map((item) => item._source);
    return data[0];
  }
  async getStatistics() {
    const dateSixMonthAgo = this.momentService
      .tz(process.env.TZ)
      .subtract(6, 'months')
      .format('YYYY-MM-DD');
    const yesTerDay = this.momentService
      .tz(process.env.TZ)
      .subtract(1, 'days')
      .format('YYYY-MM-DD HH:mm:ss');
    const now = this.momentService
      .tz(process.env.TZ)
      .format('YYYY-MM-DD HH:mm:ss');
    const result = await Promise.all([
      this.getList({
        start_date: dateSixMonthAgo,
        end_date: now,
      }),
      this.getList({
        start_date: yesTerDay,
        end_date: now,
      }),
    ]);
    return result.map((res) => res.total);
  }
}
