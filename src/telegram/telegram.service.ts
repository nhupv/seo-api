import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { User } from 'src/users/entities/user.entity';
export class TelegramBotService {
  constructor(@InjectQueue('send-message-telegram') private queue: Queue) {}

  async sendCotipActivities(message: string, user: User = null) {
    const data = {
      message,
      user: user,
    };
    await this.queue.add('send-activities', data);
  }

  async sendCotipLog(message: string) {
    const data = {
      chat_id: process.env.COTIP_LOG_TELEGRAM_ROOM,
      text: `[${process.env.APP_NAME}] ${message}`,
      parse_mode: 'html',
    };
    await this.queue.add('send-log', data);
  }
}
