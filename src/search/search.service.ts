import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { IndexsService } from 'src/indexs/indexs.service';

@Injectable()
export class SearchService {
  constructor(
    private readonly elasticSearchService: ElasticsearchService,
    private readonly indexService: IndexsService,
  ) {}

  async searchAll(query) {
    const arrayIndex = await this.indexService.findAll();
    const promise = arrayIndex.map((index) =>
      this.buildEachIndex(
        query,
        index.name,
        index.search_field,
        index.path,
        index.title,
      ),
    );
    const result = await Promise.all(promise);
    const filterResult = result.filter((data) => data.total > 0);
    let last = [];
    filterResult.forEach((data) => (last = [...last, ...data.data]));
    return last;
  }

  private async searchIndex(query, indexName, field, path) {
    const { size, page } = query;
    // if (!size) {
    //   size = process.env.ELASTIC_SIZE_DEFAULT;
    // }
    const paramQuery = await this.buildDynamicParam(query, field);

    const { body } = await this.elasticSearchService.search<any>(
      {
        index: indexName,
        body: paramQuery,
        size: 5,
        from: page * size || 0,
      },
      {
        ignore: [404],
      },
    );
    const { total, hits } = body.hits;

    const data = hits.map(({ _id, _source }) => ({
      id: _id,
      title:
        indexName === process.env.POST_INDEX
          ? _source.category
          : _source[field],
      description: _source.description || _source.article,
      date: _source.iso_time,
      path: path,
    }));
    return { total, data };
  }

  async buildDynamicParam(query, field) {
    const { search, start_date, end_date } = query;
    const must = [];
    if (start_date && end_date) {
      must.push({
        range: {
          iso_time: {
            gte: start_date,
            lte: end_date,
            format: 'yyyy-MM-dd HH:mm:ss||yyyy-MM-dd',
            time_zone: '+07:00',
          },
        },
      });
    }

    must.push({
      multi_match: {
        query: search,
        fields: [field],
        type: 'phrase_prefix',
      },
    });

    const paramQuery = {
      query: {
        bool: {
          must: must,
        },
      },
      sort: [
        {
          iso_time: {
            order: 'desc',
          },
        },
        '_score',
      ],
    };
    return paramQuery;
  }

  private async buildEachIndex(query, indexName, field, path, title) {
    const { total, data } = await this.searchIndex(
      query,
      indexName,
      field,
      path,
    );
    return {
      title: title,
      path: path,
      total: total,
      data: [{ header: title }, { divider: true }, ...data],
    };
  }

  async searchSeflAll(query) {
    const arrayIndex = await this.indexService.findAll();
    const { search, start_date, end_date } = query;
    const paramQuery = await this.buildParams(search, start_date, end_date);
    const promiseSearch = arrayIndex.map((index) =>
      this.searchOneIndex(index, paramQuery),
    );
    const result = await Promise.all(promiseSearch);
    return result.filter((data) => data.total > 0);
  }
  private async searchOneIndex(index, paramQuery) {
    const { body } = await this.elasticSearchService.search<any>({
      index: index.name,
      body: paramQuery,
      size: 100,
    });
    const { total, hits } = body.hits;
    const data = hits.map(({ _id, _source }) => ({
      id: _id,
      title:
        index.name === process.env.POST_INDEX
          ? _source.category
          : _source[index.search_field],
      description: _source.description || _source.article,
    }));
    return {
      title: index.title,
      path: index.path,
      total,
      data: data,
    };
  }
  private async buildParams(search, start_date, end_date) {
    const must = [];
    if (start_date && end_date) {
      must.push({
        range: {
          iso_time: {
            gte: start_date,
            lte: end_date,
            format: 'yyyy-MM-dd HH:mm:ss||yyyy-MM-dd',
            time_zone: '+07:00',
          },
        },
      });
    }

    must.push({
      query_string: {
        query: search,
        // type: 'phrase_prefix',
      },
    });

    const paramQuery = {
      query: {
        bool: {
          must: must,
        },
      },
      sort: [
        {
          iso_time: {
            order: 'desc',
          },
        },
        '_score',
      ],
    };
    return paramQuery;
  }
}
