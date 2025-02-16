import { TransactionType } from '@prisma/client';

export class GetTransactionsDto {
  wallet: string;
  type?: TransactionType;
}
