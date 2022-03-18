import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { ConvertDTO, DepositDTO, TransferDTO, WithdrawDTO } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}
  @UseGuards(JwtAuthGuard)
  @Post('deposit')
  deposit(@Body() depositDto: DepositDTO) {
    return this.walletService.deposit(depositDto);
  }

  @Post('withdraw')
  async withdraw(@Body() withdrawDto: WithdrawDTO) {
    return this.walletService.withdraw(withdrawDto);
  }

  @Post('transfer')
  transfer(@Body() transferDto: TransferDTO) {
    return this.walletService.transfer(transferDto);
  }

  @Post('convert')
  convert(@Body() convertDto: ConvertDTO) {
    return this.walletService.convert(convertDto);
  }
}
