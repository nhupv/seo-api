import { IntersectionType, OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { UpdateFidoUser } from './update-fido-user.dto';

export class UpdateUserDto extends IntersectionType(
  OmitType(CreateUserDto, ['email', 'password', 'fido_user'] as const),
  UpdateFidoUser,
) {}
