import { Strategy, StrategyOptionsWithRequest } from 'passport-oauth2';
import { PassportStrategy } from '@nestjs/passport';
import { HttpService, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
// import { SessionService } from '../session/session.service';

@Injectable()
export class Fido2Strategy extends PassportStrategy(Strategy, 'fido2') {
  constructor(
    private readonly userService: UsersService,
    private readonly http: HttpService, // private readonly sessionService: SessionService,
  ) {
    super({
      authorizationURL: `${process.env.FIDO_AUTHORIZATION_URL}/authorize`,
      tokenURL: `${process.env.FIDO_AUTHORIZATION_URL}/token`,
      clientID: process.env.FIDO_CLIENT_ID,
      clientSecret: process.env.FIDO_CLIENT_SECRET,
      callbackURL: process.env.FIDO_CALLBACK_URL,
      passReqToCallback: true,
    } as StrategyOptionsWithRequest);
  }

  async validate(
    req: any,
    accessToken: string,
    refreshToken: string,
    params,
    profile,
    verified,
  ): Promise<any> {
    console.log(req);
    console.log(accessToken);
    console.log(profile);
    console.log(verified);
    const { state, session } = req.query;
    // const sessionInDb = await this.sessionService.findOneBySession(session);
    // if (sessionInDb && sessionInDb.state !== state) {
    //   throw new UnauthorizedException();
    // }
    const { data } = await this.http
      .post(
        `${process.env.FIDO_AUTHORIZATION_URL}/profile`,
        {
          access_token: accessToken,
        },
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        },
      )
      .toPromise();
    const fidoUsername = data.user_name;
    console.log(fidoUsername);
    const user = await this.userService.findByFidoName(fidoUsername);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
