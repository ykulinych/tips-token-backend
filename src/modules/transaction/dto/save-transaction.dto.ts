import { TransactionType } from '@prisma/client';

export class SaveTransactionDto {
  sender: string;
  recipient: string;
  amount: number;
  token: string;
  type?: TransactionType;
}
