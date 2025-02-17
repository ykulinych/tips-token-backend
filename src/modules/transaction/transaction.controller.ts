import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { SaveTransactionDto } from './dto/save-transaction.dto';
import { GetTransactionsDto } from './dto/get-transactions.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  saveTransaction(@Body() body: SaveTransactionDto) {
    return this.transactionService.saveTransaction(body);
  }

  @Get()
  getTransactions(@Query() query: GetTransactionsDto) {
    return this.transactionService.getTransactions(query);
  }
}
