import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request,
  Post,
  Delete,
  Body,
  HttpStatus,
  Response,
} from '@nestjs/common';
import { AppService } from './app.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { Public } from './decorator/public.decorator';
import { Fido2AuthGuard } from './guard/fido2-auth.guard';
// import { FidoSessionDto } from './dto/fido-session.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get('profile')
  getProfile(@Request() req, @Response() res) {
    return res.status(HttpStatus.OK).json({ data: req.user });
  }

  // @Public()
  // @Get('fido2/uri')
  // async getUrlRedirect(@Query() sessionDto: FidoSessionDto) {
  //   const sessionID = sessionDto.session_id;
  //   return this.appService.requestFido2RedirectUri(sessionID);
  // }

  @Public()
  @Get('auth/fido2')
  @UseGuards(Fido2AuthGuard)
  loginByFido2(@Request() req) {
    return this.authService.login(req.user);
  }

  @Delete('auth/logout')
  async logout(@Request() req) {
    return this.authService.logout(req.user);
  }
}
