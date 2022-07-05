import { IsNotEmpty } from 'class-validator';

export class FidoSessionDto {
  @IsNotEmpty()
  session_id: string;
}
