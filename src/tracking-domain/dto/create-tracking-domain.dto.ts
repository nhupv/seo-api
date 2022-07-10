import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTrackingDomainDto {
  @IsNotEmpty()
  domain: string;

  @IsNotEmpty()
  category: string;

  @IsNotEmpty()
  name: string;
}
