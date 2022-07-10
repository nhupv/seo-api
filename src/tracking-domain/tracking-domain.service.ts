import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTrackingDomainDto } from './dto/create-tracking-domain.dto';
import { UpdateTrackingDomainDto } from './dto/update-tracking-domain.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Model, ObjectId } from 'mongoose';
import { TrackingDomain } from './entities/tracking-domain.entity';
import { PaginationResultInterface } from '../pagination/interface/pagination-result.interface';

@Injectable()
export class TrackingDomainService {
  constructor(
    @InjectModel(TrackingDomain.name)
    private trackingDomainModel: Model<TrackingDomain>,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}
  create(
    createTrackingDomainDto: CreateTrackingDomainDto,
  ): Promise<TrackingDomain> {
    const newTrackingDomain = new this.trackingDomainModel(
      createTrackingDomainDto,
    );
    return newTrackingDomain.save();
  }
  async createBulk(trackingDomainList: Array<CreateTrackingDomainDto>) {
    // console.log(trackingDomainList);
    // const session = await this.connection.startSession();
    // session.startTransaction();
    try {
      // const tD = await this.trackingDomainModel.insertMany(trackingDomainList, {
      //   session,
      // });
      const tD = await this.trackingDomainModel.insertMany(trackingDomainList);
      // await session.commitTransaction();
      return tD;
    } catch (e) {
      // await session.abortTransaction();
      throw new BadRequestException('Format file is not correct');
    } finally {
      // session.endSession();
    }
  }
  async findAll(
    skip: number,
    limit: number,
    sortBy: string,
    sortType: string,
  ): Promise<PaginationResultInterface<TrackingDomain>> {
    const total = await this.trackingDomainModel.countDocuments().exec();
    const data = await this.trackingDomainModel
      .find()
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: [sortType] })
      .exec();
    return { data, total };
  }

  findOne(id: ObjectId): Promise<TrackingDomain> {
    return this.trackingDomainModel.findOne({ _id: id }).exec();
  }

  update(
    id: ObjectId,
    updateTrackingDomainDto: UpdateTrackingDomainDto,
  ): Promise<TrackingDomain> {
    return this.trackingDomainModel
      .findOneAndUpdate({ _id: id }, updateTrackingDomainDto, {
        new: true,
      })
      .exec();
  }

  remove(id: ObjectId) {
    return this.trackingDomainModel.findOneAndDelete({ _id: id });
  }
}
