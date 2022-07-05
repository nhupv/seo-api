import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Role } from 'src/roles/role.enum';

@ValidatorConstraint({ name: 'customText', async: false })
export class CheckRoleUser implements ValidatorConstraintInterface {
  validate(roles: Role[], args: ValidationArguments) {
    const roleAccept = [Role.User, Role.Admin];
    return (
      !(new Set(roles).size !== roles.length) &&
      roles.every((role) => roleAccept.includes(role))
    );
  }

  defaultMessage(args: ValidationArguments) {
    return 'roles is invalid';
  }
}
