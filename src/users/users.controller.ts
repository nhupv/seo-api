import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Request,
  Scope,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ObjectId } from 'mongoose';
import { User } from './entities/user.entity';
import { Role } from 'src/roles/role.enum';
import { Roles } from 'src/decorator/roles.decorator';
import { TelegramBotService } from 'src/telegram/telegram.service';
import { PaginationParams } from '../pagination/dto/papgination-params.dto';
import { PaginationInterceptor } from '../pagination/interceptor/pagination.interceptor';

@Roles(Role.Admin, Role.SuperUser)
@Controller({
  path: 'users',
  scope: Scope.REQUEST,
})
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly telegramService: TelegramBotService,
  ) {}

  @Post()
  async create(@Request() req, @Body() createUserDto: CreateUserDto) {
    // this.telegramService.sendCotipActivities(
    //   `Create new user with email: ${user.email}`,
    //   req.user,
    // );
    try {
      return await this.usersService.create(createUserDto);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  @Get()
  @UseInterceptors(PaginationInterceptor)
  findAll(
    @Request() req,
    @Query() { perPage, sortBy, sortType }: PaginationParams,
  ) {
    return this.usersService.findAll(
      req.user.id,
      req.query.skip,
      perPage,
      sortBy,
      sortType,
    );
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: ObjectId): Promise<User> {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  @Patch(':id')
  async update(
    @Param('id') id: ObjectId,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const userUpdate = await this.usersService.findOne(id);
    if (!userUpdate) {
      throw new NotFoundException(`User with id ${id} was not found!`);
    }
    const { fido_user } = updateUserDto;

    if (fido_user) {
      const fidoExisted = await this.usersService.findByFidoName(fido_user);

      if (fidoExisted && fidoExisted.fido_user !== userUpdate.fido_user) {
        throw new BadRequestException([
          `Fido user with name ${fido_user} has existed!`,
        ]);
      }
    }
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Request() req, @Param('id') id: ObjectId) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} was not found.`);
    }
    if (user.id === req.user.id) {
      throw new BadRequestException(`Can not delete user is logged in.`);
    }
    // this.telegramService.sendCotipActivities(
    //   `Delete user with email: ${user.email}`,
    //   req.user,
    // );
    return this.usersService.remove(id);
  }
}
