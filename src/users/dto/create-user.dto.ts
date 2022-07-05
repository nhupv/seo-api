import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsNumber,
  IsArray,
  Validate,
  IsOptional,
  MinLength,
  IsDefined,
} from 'class-validator';
import { Role } from 'src/roles/role.enum';
import { CheckFidoUserExisted } from 'src/validator/CheckFidoUserExisted';
import { CheckRoleUser } from 'src/validator/CheckRoleUser';
import { CheckUserExisted } from 'src/validator/CheckUserExisted';
export class CreateUserDto {
  @IsEmail()
  @Validate(CheckUserExisted, {
    message: 'Email $value already exists.',
  })
  email: string;

  @IsNotEmpty()
  username: string;

  @IsOptional()
  @IsNumber()
  age;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @MinLength(3)
  @Validate(CheckFidoUserExisted)
  @IsNotEmpty()
  @IsDefined()
  fido_user: string;

  @IsNotEmpty()
  @IsArray()
  @Validate(CheckRoleUser, {
    message: 'Roles is invalid.',
  })
  roles: Role[];
}
