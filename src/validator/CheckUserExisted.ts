import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { UsersService } from 'src/users/users.service';

@ValidatorConstraint({ name: 'isUserAlreadyExist', async: true })
export class CheckUserExisted implements ValidatorConstraintInterface {
  constructor(private readonly userService: UsersService) {}
  async validate(email: string, args: ValidationArguments) {
    const userExisted = await this.userService.findByUsername(email);
    return !userExisted;
  }

  defaultMessage(args: ValidationArguments) {
    return 'User has existed!';
  }
}
