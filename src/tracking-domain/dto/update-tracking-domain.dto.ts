import { PartialType } from '@nestjs/mapped-types';
import { CreateTrackingDomainDto } from './create-tracking-domain.dto';

export class UpdateTrackingDomainDto extends PartialType(
  CreateTrackingDomainDto,
) {}
