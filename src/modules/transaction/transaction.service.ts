import { Injectable } from '@nestjs/common';
import { GetTransactionsDto } from './dto/get-transactions.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Transaction } from '@prisma/client';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

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
