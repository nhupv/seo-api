import {
  Body,
  Controller,
  Get,
  Query,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { QuerySearchPost } from './dto/query-search.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Get()
  async index(@Query() querySearchPost: QuerySearchPost) {
    const { total, data } = await this.postService.search(querySearchPost);
    return { total, data };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const post = await this.postService.findOne(id);
    if (!post) {
      throw new NotFoundException(`Post with id ${id} was not found!`);
    }
    return post;
  }
}
