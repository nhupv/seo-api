import { Injectable } from '@nestjs/common';
import { CreateDomainDto } from './dto/create-domain.dto';
import { UpdateDomainDto } from './dto/update-domain.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Domain } from './entities/domain.entity';
import { PaginationResultInterface } from '../pagination/interface/pagination-result.interface';

@Injectable()
export class DomainService {
  constructor(@InjectModel('Domain') private domainModel: Model<Domain>) {}
  create(createDomainDto: CreateDomainDto): Promise<Domain> {
    const newDomain = new this.domainModel(createDomainDto);
    return newDomain.save();
  }

  async findAll(
    skip: number,
    limit: number,
    sortBy: string,
    sortType: string,
  ): Promise<PaginationResultInterface<Domain>> {
    const total = await this.domainModel.countDocuments().exec();
    const data = await this.domainModel
      .find()
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: [sortType] })
      .exec();
    return { data, total };
  }
  findByAuctionId(auctionId: string): Promise<Domain> {
    return this.domainModel.findOne({ auctionId }).exec();
  }
  findByDomainName(name: string): Promise<Domain> {
    return this.domainModel.findOne({ name }).exec();
  }
  findOne(id: ObjectId): Promise<Domain> {
    return this.domainModel.findOne({ _id: id }).exec();
  }

  update(id: ObjectId, updateDomainDto: UpdateDomainDto): Promise<Domain> {
    return this.domainModel
      .findOneAndUpdate({ _id: id }, updateDomainDto, {
        new: true,
      })
      .exec();
  }

  remove(id: ObjectId) {
    return this.domainModel.findOneAndDelete({ _id: id });
  }
}
