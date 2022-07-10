import { Module } from '@nestjs/common';
import { DomainService } from './domain.service';
import { DomainController } from './domain.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DomainSchema } from './entities/domain.entity';
import { CheckDomainExisted } from '../validator/CheckDomainExisted';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Domain', schema: DomainSchema }]),
  ],
  controllers: [DomainController],
  providers: [DomainService, CheckDomainExisted],
})
export class DomainModule {}
