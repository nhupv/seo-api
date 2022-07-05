import { InjectModel } from '@nestjs/mongoose';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Model } from 'mongoose';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@ValidatorConstraint({ name: 'isUserAlreadyExist', async: true })
export class CheckUserExisted implements ValidatorConstraintInterface {
  constructor(private readonly userService: UsersService) {}
  async validate(email: string, args: ValidationArguments) {
    const userExisted = await this.userService.findByUsername(email);
    if (!userExisted) {
      return true;
    }
    return false;
  }

  defaultMessage(args: ValidationArguments) {
    return 'User has existed!';
  }
}
