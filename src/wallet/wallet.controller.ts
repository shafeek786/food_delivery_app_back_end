import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { AuthGuard } from '@nestjs/passport';
import { AddToWallet } from './dto/addToWallet.DTO';
import { error } from 'console';

@Controller('wallet')
export class WalletController {
  constructor(private walletService: WalletService) {}

  @Post('addtowallet/:id')
  @UseGuards(AuthGuard())
  async addToWallet(@Param('id') id: string, @Body() wallet: AddToWallet) {
    const { amount } = wallet;
    console.log('add balamnce', amount);
    const result = await this.walletService.addToWallet(id, amount);
    return result;
  }

  @Get('getbalance/:id')
  @UseGuards(AuthGuard())
  async getBalance(@Param('id') id: string) {
    try {
      console.log('get balamnce');
      const result = await this.walletService.getBalance(id);
      return result;
    } catch (error) {
      console.log(error);
    }
  }
}
