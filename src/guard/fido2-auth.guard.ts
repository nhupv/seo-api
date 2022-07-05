import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class Fido2AuthGuard extends AuthGuard('fido2') {}
