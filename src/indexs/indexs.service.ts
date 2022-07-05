import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { CreateIndexDto } from './dto/create-index.dto';
import { UpdateIndexDto } from './dto/update-index.dto';
import { Index } from './entities/index.entity';
@Injectable()
export class IndexsService {
  constructor(@InjectModel('Index') private indexModel: Model<Index>) {}

  async create(createIndexDto: CreateIndexDto): Promise<Index> {
    const createIndex = new this.indexModel(createIndexDto);
    return createIndex.save();
  }

  async findAll(): Promise<Index[]> {
    return this.indexModel
      .find()
      .populate('created_by', 'username email')
      .exec();
  }

  findOne(id: ObjectId) {
    return this.indexModel.findById(id);
  }

  async update(id: ObjectId, updateIndexDto: UpdateIndexDto) {
    return await this.indexModel
      .findOneAndUpdate({ _id: id }, updateIndexDto, {
        new: true,
      })
      .populate('created_by', 'username email');
  }

  remove(id: ObjectId) {
    return this.indexModel.findOneAndDelete({ _id: id });
  }
  async findByName(name: string) {
    return await this.indexModel.findOne({ name });
  }
}
