import {
  IsNotEmpty,
  IsDate,
  IsOptional,
  Validate,
  IsISO8601,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CheckDomainExisted } from '../../validator/CheckDomainExisted';

export class CreateDomainDto {
  @IsNotEmpty()
  @Validate(CheckDomainExisted, {
    message: 'Domain with auctionId $value already exists.',
  })
  auctionId: string;

  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsISO8601({ strict: true })
  endTime: string;

  @IsOptional()
  winning: string;

  @IsOptional()
  highBid: string;

  @IsOptional()
  maxBid: string;

  @IsOptional()
  numberOfBidders: number;

  @IsOptional()
  highestBidder: number;

  @IsOptional()
  minimumNextBid: number;

  @IsOptional()
  bidIncrement: number;

  @IsOptional()
  type: string;
}
