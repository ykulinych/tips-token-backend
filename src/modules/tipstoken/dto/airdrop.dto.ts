import { IsNotEmpty, IsString } from 'class-validator';
export class AirdropDto {
  @IsString()
  @IsNotEmpty()
  recipientAddress: string;
}
