import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { TelegramBotService } from './telegram/telegram.service';
@Injectable()
export class AppService {
  constructor(private telegramService: TelegramBotService) {}
  async requestFido2RedirectUri(
    sessionID: string,
  ): Promise<{ redirect_uri: string }> {
    const state = await this.generateState(sessionID);
    if (!state) {
      return;
    }
    console.log(state);
    const queryParams: string[] = [
      `client_id=${process.env.FIDO_CLIENT_ID}`,
      `redirect_uri=${process.env.FIDO_CALLBACK_URL}`,
      `client_secret=${process.env.FIDO_CLIENT_SECRET}`,
      `response_type=code`,
      `state=${state}`,
    ];
    const redirect_uri = `${
      process.env.FIDO_AUTHORIZATION_URL
    }/authorize?${queryParams.join('&')}`;

    return {
      redirect_uri,
    };
  }
  async generateState(sessionID): Promise<string> {
    const state = uuid();
    //save sessionID as a key, value is state to db
    try {
      // await this.sessionService.create({ session_id: sessionID, state });
      return state;
    } catch (e) {
      console.log(e);
      await this.telegramService.sendCotipLog(
        'Error when create session login!',
      );
      return '';
    }
  }
}
