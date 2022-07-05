import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { TelegramBotService } from '../telegram/telegram.service';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private telegramService: TelegramBotService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (user) {
      const isMatch = await bcrypt.compare(pass, user.password);
      if (isMatch) {
        return user;
      }
    }
    // this.telegramService.sendCotipActivities(
    //   `User login fail with email: ${username}`,
    // );
    return null;
  }

  async login(user: any) {
    const payload = { username: user.email, sub: user.id };
    // this.telegramService.sendCotipActivities(
    //   `User login success with email: ${user.email}`,
    // );
    return {
      access_token: this.jwtService.sign(payload),
      type: 'Bearer',
    };
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async logout(user: any) {}
}
