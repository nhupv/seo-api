import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { UsersService } from 'src/users/users.service';

@ValidatorConstraint({ async: false })
export class CheckFidoUserExisted implements ValidatorConstraintInterface {
  constructor(private readonly userService: UsersService) {}
  async validate(fido: string, args: ValidationArguments) {
    const fidoUserExisted = await this.userService.findByFidoName(fido);
    if (!fidoUserExisted) {
      return true;
    }
    return false;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Fido user has existed!';
  }
}
