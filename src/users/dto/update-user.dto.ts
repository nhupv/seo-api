import {
  IntersectionType,
  OmitType,
  PartialType,
  PickType,
} from '@nestjs/mapped-types';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { Role } from 'src/roles/role.enum';
import { CheckFidoUserExisted } from 'src/validator/CheckFidoUserExisted';
import { CheckRoleUser } from 'src/validator/CheckRoleUser';
import { CreateUserDto } from './create-user.dto';
import { UpdateFidoUser } from './update-fido-user.dto';

// export class UpdateUserDto extends PickType(CreateUserDto, [
//   'username',
//   'age',
//   'roles',
//   'fido_user',
// ] as const) {}
export class UpdateUserDto extends IntersectionType(
  OmitType(CreateUserDto, ['email', 'password', 'fido_user'] as const),
  UpdateFidoUser,
) {}
