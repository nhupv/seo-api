import { Module } from '@nestjs/common';
import { TelegramBotService } from './telegram.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegramConsumer } from './telegram.consumer';
import { TelegramModule } from 'nestjs-telegram';
import { BullModule } from '@nestjs/bull';
@Module({
  imports: [
    BullModule.registerQueue({
      name: 'send-message-telegram',
    }),
    TelegramModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        botKey: configService.get('TELEGRAM_BOT_TOKEN'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [TelegramBotService, TelegramConsumer],
  exports: [TelegramBotService],
})
export class TelegramBotModule {}
