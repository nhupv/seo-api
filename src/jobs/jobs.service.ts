import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, Interval } from '@nestjs/schedule';
import { TelegramBotService } from '../telegram/telegram.service';
import * as moment from 'moment-timezone';
@Injectable()
export class JobsService {
  constructor(
    private readonly telegramService: TelegramBotService,
    @Inject('Moment') private momentService: moment.Moment,
  ) {}
  private readonly logger = new Logger(JobsService.name);

  @Cron('45 13 * * *', {
    name: 'testCronJob',
    timeZone: process.env.TZ,
  })
  async handleCron() {
    await this.telegramService.sendCotipLog(
      'Call one time at 13:45 pm everyday',
    );
  }

  @Cron('0 6 * * *', {
    name: 'countCveYearly',
    timeZone: process.env.TZ,
  })
  async handleInterval() {
    let firstYear = 1999;
    const totalData = [];
    const now = moment().year();
    while (firstYear <= now) {
      const startDate = moment(`${firstYear}-01-01`).format('YYYY-MM-DD');
      const endDate = moment(startDate).endOf('year').format('YYYY-MM-DD');
      // const { total } = await this.cveService.getList({
      //   start_date: startDate,
      //   end_date: endDate,
      // });
      // const cveYearly = {
      //   year: String(firstYear),
      //   value: total,
      // };
      // await this.cveYearlyService.create(cveYearly);
      // totalData.push(cveYearly);
      firstYear++;
    }
    await this.telegramService.sendCotipLog(JSON.stringify(totalData));
  }
}
