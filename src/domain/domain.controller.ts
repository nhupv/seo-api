import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  UseInterceptors,
  Query,
  Request,
} from '@nestjs/common';
import { DomainService } from './domain.service';
import { CreateDomainDto } from './dto/create-domain.dto';
import { UpdateDomainDto } from './dto/update-domain.dto';
import { Roles } from '../decorator/roles.decorator';
import { Role } from '../roles/role.enum';
import { ObjectId } from 'mongoose';
import { PaginationParams } from '../pagination/dto/papgination-params.dto';
import { PaginationInterceptor } from '../pagination/interceptor/pagination.interceptor';

@UseInterceptors(PaginationInterceptor)
@Roles(Role.Admin, Role.SuperUser)
@Controller('domains')
export class DomainController {
  constructor(private readonly domainService: DomainService) {}

  @Post()
  create(@Body() createDomainDto: CreateDomainDto) {
    return this.domainService.create(createDomainDto);
  }

  @Get()
  findAll(
    @Request() req,
    @Query() { perPage, sortBy, sortType }: PaginationParams,
  ) {
    return this.domainService.findAll(
      req.query.skip,
      perPage,
      sortBy,
      sortType,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: ObjectId) {
    const domain = await this.domainService.findOne(id);
    if (!domain) {
      throw new NotFoundException();
    }
    return domain;
  }

  @Patch(':id')
  async update(
    @Param('id') id: ObjectId,
    @Body() updateDomainDto: UpdateDomainDto,
  ) {
    const domainUpdate = await this.domainService.findOne(id);
    if (!domainUpdate) {
      throw new NotFoundException(`Domain with id ${id} was not found!`);
    }
    return this.domainService.update(id, updateDomainDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: ObjectId) {
    const domain = await this.domainService.findOne(id);
    if (!domain) {
      throw new NotFoundException(`Domain with id ${id} was not found.`);
    }
    return this.domainService.remove(id);
  }
}
