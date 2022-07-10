import { HttpModule, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { TelegramBotModule } from 'src/telegram/telegram.module';
import { Fido2Strategy } from './fido2.strategy';
// import { SessionModule } from '../session/session.module';
@Module({
  imports: [
    UsersModule,
    TelegramBotModule,
    HttpModule,
    PassportModule,
    // SessionModule,
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: { expiresIn: jwtConstants.expire },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
