import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  BadRequestException,
  UseInterceptors,
  NotFoundException,
  Put,
} from '@nestjs/common';
import { IndexsService } from './indexs.service';
import { CreateIndexDto } from './dto/create-index.dto';
import { UpdateIndexDto } from './dto/update-index.dto';
import { ObjectId } from 'mongoose';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { CreateIndexInterceptor } from './create-index.interceptor';
import { Role } from 'src/roles/role.enum';
import { Roles } from 'src/decorator/roles.decorator';

@Controller('indexs')
@Roles(Role.SuperUser)
@UseInterceptors(CreateIndexInterceptor)
export class IndexsController {
  constructor(
    private readonly indexsService: IndexsService,
    private readonly elasticService: ElasticsearchService,
  ) {}

  @Post()
  async create(@Body() createIndexDto: CreateIndexDto) {
    const { name } = createIndexDto;

    const indexExisted = await this.indexsService.findByName(name);
    if (indexExisted) {
      throw new BadRequestException('Index name has existed!');
    }
    const { body } = await this.elasticService.indices.exists({
      index: name,
    });

    if (!body) {
      throw new BadRequestException('Index name not found on Node!');
    }
    return this.indexsService.create(createIndexDto);
  }

  @Get()
  findAll() {
    return this.indexsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: ObjectId) {
    return this.indexsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: ObjectId,
    @Body() updateIndexDto: UpdateIndexDto,
  ) {
    const indexUpdate = await this.indexsService.findOne(id);
    if (!indexUpdate) {
      throw new NotFoundException(`Index with id ${id} was not found!`);
    }
    const indexUpdated = await this.indexsService.update(id, updateIndexDto);
    return indexUpdated;
  }

  @Delete(':id')
  async remove(@Param('id') id: ObjectId) {
    const indexUpdate = await this.indexsService.findOne(id);
    if (!indexUpdate) {
      throw new NotFoundException(`Index with id ${id} was not found!`);
    }
    return this.indexsService.remove(id);
  }
}
