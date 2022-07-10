import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { TelegramBotModule } from '../telegram/telegram.module';
import * as moment from 'moment-timezone';
// import { CveModule } from '../cve/cve.module';
// import { CveYearlyModule } from '../cve-yearly/cve-yearly.module';

@Module({
  imports: [TelegramBotModule],
  controllers: [JobsController],
  providers: [
    JobsService,
    {
      provide: 'Moment',
      useValue: moment,
    },
  ],
})
export class JobsModule {}
