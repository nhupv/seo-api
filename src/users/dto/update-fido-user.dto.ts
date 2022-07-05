import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateFidoUser {
  @IsOptional()
  @IsString()
  @MinLength(3)
  fido_user: string;
}
