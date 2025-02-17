import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Transaction, TransactionType } from '@prisma/client';
import { SaveTransactionDto } from './dto/save-transaction.dto';
import { GetTransactionsDto } from './dto/get-transactions.dto';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  async saveTransaction(body: SaveTransactionDto): Promise<Transaction> {
    return this.prisma.transaction.create({
      data: {
        type: TransactionType.TRANSFER,
        ...body,
      },
    });
  }

  async getTransactions(query: GetTransactionsDto): Promise<Transaction[]> {
    const { wallet, type } = query;
    return this.prisma.transaction.findMany({
      where: {
        OR: [{ sender: wallet }, { recipient: wallet }],
        type,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
