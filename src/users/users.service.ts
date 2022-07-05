import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model, ObjectId } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createUser = new this.userModel(createUserDto);
    return createUser.save();
  }

  async findAll(id: ObjectId): Promise<User[]> {
    return this.userModel.find({ _id: { $ne: id } }).exec();
  }

  async findOne(id: ObjectId): Promise<User> {
    return await this.userModel.findOne({ _id: id });
  }

  update(id: ObjectId, updateUserDto: UpdateUserDto) {
    return this.userModel.findOneAndUpdate({ _id: id }, updateUserDto, {
      new: true,
    });
  }

  remove(id: ObjectId) {
    return this.userModel.findOneAndDelete({ _id: id });
  }
  async findByUsername(username: string): Promise<User | undefined> {
    return await this.userModel
      .findOne({ email: username })
      .select('+password');
  }
  async findByFidoName(fidoUser: string): Promise<User | undefined> {
    return await this.userModel.findOne({ fido_user: fidoUser });
  }
}
