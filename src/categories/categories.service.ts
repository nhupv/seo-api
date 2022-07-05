import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category, CategoryDocument } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category') private categoryModel: Model<CategoryDocument>,
  ) {}
  create(createCategoryDto: CreateCategoryDto) {
    const categoryCreate = new this.categoryModel(createCategoryDto);
    return categoryCreate.save();
  }

  findAll(): Promise<Category[]> {
    return this.categoryModel.find().exec();
  }

  findBulk(ids: ObjectId[]): Promise<Category[]> {
    return this.categoryModel.find({ _id: { $in: ids } }).exec();
  }

  async findOne(id: number): Promise<Category> {
    return await this.categoryModel.findById(id);
  }

  update(id: ObjectId, updateCategoryDto: UpdateCategoryDto): string {
    return 'update';
  }

  remove(id: number) {
    return this.categoryModel.findByIdAndRemove(id);
  }

  async findeByName(name: string) {
    return await this.categoryModel.findOne({ name });
  }
}
