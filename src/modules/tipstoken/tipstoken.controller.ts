import { Body, Controller, Post } from '@nestjs/common';
import { TipstokenService } from './tipstoken.service';
import { AirdropDto } from './dto/airdrop.dto';

@Controller('tips-token')
export class TipstokenController {
  constructor(private readonly tipstokenService: TipstokenService) {}

  @Post('airdrop')
  async airdrop(@Body() body: AirdropDto) {
    return await this.tipstokenService.airdrop(body, 50);
  }
}
