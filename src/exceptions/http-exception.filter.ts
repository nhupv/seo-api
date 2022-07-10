import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { TelegramBotService } from '../telegram/telegram.service';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  // constructor(private readonly telegramService: TelegramBotService) {}
  private readonly logger = new Logger('Server SEO API', true);
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message = exception.message;

    if (status >= 500) {
      this.logger.error(message);
      // this.telegramService.sendCotipLog(message);
    }

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
