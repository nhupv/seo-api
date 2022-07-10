import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model, ObjectId } from 'mongoose';
import { PaginationResultInterface } from '../pagination/interface/pagination-result.interface';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createUser = new this.userModel(createUserDto);
    return createUser.save();
  }

  async findAll(
    id: ObjectId,
    skip: number,
    limit: number,
    sortBy: string,
    sortType: string,
  ): Promise<PaginationResultInterface<User>> {
    const total = await this.userModel
      .countDocuments({ _id: { $ne: id } })
      .exec();
    const data = await this.userModel
      .find({ _id: { $ne: id } })
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: [sortType] })
      .exec();
    return { data, total };
  }

  findOne(id: ObjectId): Promise<User> {
    return this.userModel.findOne({ _id: id }).exec();
  }

  update(id: ObjectId, updateUserDto: UpdateUserDto) {
    return this.userModel.findOneAndUpdate({ _id: id }, updateUserDto, {
      new: true,
    });
  }

  remove(id: ObjectId) {
    return this.userModel.findOneAndDelete({ _id: id });
  }
  findByUsername(username: string): Promise<User | undefined> {
    return this.userModel
      .findOne({ email: username })
      .select('+password')
      .exec();
  }
  findByFidoName(fidoUser: string): Promise<User | undefined> {
    return this.userModel.findOne({ fido_user: fidoUser }).exec();
  }
}
