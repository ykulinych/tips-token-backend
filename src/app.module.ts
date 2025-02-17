import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionModule } from './modules/transaction/transaction.module';
import { TipstokenModule } from './modules/tipstoken/tipstoken.module';

@Module({
  imports: [TransactionModule, TipstokenModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
