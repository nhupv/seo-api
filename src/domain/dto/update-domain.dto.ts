import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateDomainDto } from './create-domain.dto';

export class UpdateDomainDto extends OmitType(CreateDomainDto, [
  'auctionId',
] as const) {}
