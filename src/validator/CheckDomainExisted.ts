import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { DomainService } from '../domain/domain.service';

@ValidatorConstraint({ name: 'isDomainAlreadyExist', async: true })
export class CheckDomainExisted implements ValidatorConstraintInterface {
  constructor(private readonly domainService: DomainService) {}
  async validate(auctionId: string, args: ValidationArguments) {
    const domainExisted = await this.domainService.findByAuctionId(auctionId);
    return !domainExisted;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Domain has existed!';
  }
}
