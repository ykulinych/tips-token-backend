import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { TipstokenController } from './tipstoken.controller';
import { TipstokenService } from './tipstoken.service';

@Module({
  imports: [PrismaModule],
  controllers: [TipstokenController],
  providers: [TipstokenService],
})
export class TipstokenModule {}
