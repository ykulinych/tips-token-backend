import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TransactionType } from '@prisma/client';

export class GetTransactionsDto {
  @IsString()
  @IsNotEmpty()
  wallet: string;

  @IsEnum(TransactionType)
  @IsOptional()
  type?: TransactionType;
}
