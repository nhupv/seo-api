import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { TelegramService } from 'nestjs-telegram';
import {
  TelegramMessage,
  TelegramSendMessageParams,
} from 'nestjs-telegram/dist/interfaces/telegramTypes.interface';
@Processor('send-message-telegram')
export class TelegramConsumer {
  constructor(private readonly telegramService: TelegramService) {}
  private readonly logger = new Logger(TelegramConsumer.name);

  @Process('send-activities')
  async sendMessageActivities(job: Job<any>): Promise<TelegramMessage> {
    const dateTime = new Date().toLocaleString('UTC', {
      timeZone: process.env.TZ,
    });
    const username = job.data.user ? job.data.user.email : '-';
    const data = {
      chat_id: process.env.COTIP_ACTIVITIES_TELEGRAM_ROOM,
      text: `[${process.env.APP_NAME} ${dateTime}] [${username}] ${job.data.message}`,
    };
    return this.telegramService.sendMessage(data).toPromise();
  }

  @Process('send-log')
  async sendLog(job: Job<TelegramSendMessageParams>): Promise<TelegramMessage> {
    return this.telegramService.sendMessage(job.data).toPromise();
  }
}
