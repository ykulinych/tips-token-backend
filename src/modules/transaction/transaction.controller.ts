import { Controller, Get, Query } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { GetTransactionsDto } from './dto/get-transactions.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  getTransactions(@Query() query: GetTransactionsDto) {
    return this.transactionService.getTransactions(query);
  }
}
