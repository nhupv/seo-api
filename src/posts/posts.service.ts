import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { QuerySearchPost } from './dto/query-search.dto';
import { PostResult } from './interfaces/post-result.interface';
import { Post, POST_INDEX } from './interfaces/post.interface';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class PostsService {
  constructor(
    private readonly elasticSearchService: ElasticsearchService,
    private readonly categoriesService: CategoriesService,
  ) {}

  async search(querySearchPost: QuerySearchPost) {
    const { page } = querySearchPost;
    const paramQuery = await this.buildParams(querySearchPost);
    const { body } = await this.elasticSearchService.search<PostResult>({
      index: POST_INDEX,
      body: paramQuery,
      size: Number(process.env.ELASTIC_SIZE_DEFAULT),
      from: page * Number(process.env.ELASTIC_SIZE_DEFAULT) || 0,
    });
    const { total, hits } = body.hits;
    const data = hits.map((item) => item._source);
    return { total, data };
  }

  async buildParams(query) {
    const { search, start_date, end_date, categories } = query;
    const must = [];
    if (search) {
      must.push({
        multi_match: {
          query: search,
          fields: ['article', 'title'],
          type: 'phrase_prefix',
        },
      });
    }
    if (categories && categories.length > 0) {
      const categoriesModel = await this.categoriesService.findBulk(categories);
      const buildCategories = categoriesModel.map((category) => ({
        wildcard: { category: category.name },
      }));
      must.push({
        bool: {
          should: buildCategories,
        },
      });
    }
    if (start_date && end_date) {
      must.push({
        range: {
          post_date: {
            gte: start_date,
            lte: end_date,
            format: 'yyyy-MM-dd HH:mm:ss||yyyy-MM-dd',
            time_zone: '+07:00',
          },
        },
      });
    } else {
      if (start_date) {
        must.push({
          range: {
            post_date: {
              gte: start_date,
              format: 'yyyy-MM-dd HH:mm:ss||yyyy-MM-dd',
              time_zone: '+07:00',
            },
          },
        });
      }
      if (end_date) {
        must.push({
          range: {
            post_date: {
              lte: end_date,
              format: 'yyyy-MM-dd HH:mm:ss||yyyy-MM-dd',
              time_zone: '+07:00',
            },
          },
        });
      }
    }
    return {
      query: {
        bool: {
          must: must,
        },
      },
      sort: [
        {
          post_date: {
            order: 'desc',
          },
        },
        '_score',
      ],
    };
  }

  async searchForAll(query) {
    const { total, data } = await this.search(query);
    return {
      title: 'News',
      path: '/news',
      total: total,
      data: data,
    };
  }

  async findOne(id): Promise<Post> {
    const paramQuery = {
      query: {
        match: {
          _id: id,
        },
      },
    };
    const { body } = await this.elasticSearchService.search<PostResult>({
      index: POST_INDEX,
      body: paramQuery,
    });
    const { total, hits } = body.hits;
    const data = hits.map((item) => item._source);
    return data[0];
  }

  async getPostCve(querySearchPost: QuerySearchPost) {
    const { search, page, size } = querySearchPost;
    const buildParamSearch = {
      query: {
        bool: {
          must: [
            {
              multi_match: {
                query: search,
                fields: ['article', 'title'],
                type: 'phrase_prefix',
              },
            },
          ],
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
    const { body } = await this.elasticSearchService.search<PostResult>({
      index: POST_INDEX,
      body: buildParamSearch,
      size: size || 20,
      from: page * size || 0,
    });
    const { total, hits } = body.hits;
    const data = hits.map((item) => item._source);
    return { total, data };
  }
}
