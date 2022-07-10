import { Module } from '@nestjs/common';
import { TrackingDomainService } from './tracking-domain.service';
import { TrackingDomainController } from './tracking-domain.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TrackingDomain,
  TrackingDomainSchema,
} from './entities/tracking-domain.entity';
import { CsvModule } from 'nest-csv-parser';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TrackingDomain.name, schema: TrackingDomainSchema },
    ]),
    CsvModule,
  ],
  controllers: [TrackingDomainController],
  providers: [TrackingDomainService],
})
export class TrackingDomainModule {}
