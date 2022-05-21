import { Injectable, BadRequestException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ConvertDTO, DepositDTO, TransferDTO, WithdrawDTO } from './dto';
import { SetBalanceDto } from '../admin/dtos/setBalance.dto';
import { Wallet, WalletDocument } from './schemas/wallet.schema';
import { Users, UsersDocument } from '../users/schema/users.schema';
import { tokens, TokenSymbols } from '../utils/tokens';
import { InsufficientFundsException } from './wallet-exception';
import { conversionStatus } from '../users/enums/status.enum';
import {
  getCurrentPrices,
  calculateExchangeRate,
} from '../utils/coingecko-api';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel(Wallet.name) private walletModel: Model<WalletDocument>,
    @InjectModel(Users.name) private userModel: Model<UsersDocument>,
  ) {}

  /***
   * Create a new multi-currency wallet and return it
   */
  createWallet() {
    const tokenBalances = new Map();
    tokens.map((token) => {
      tokenBalances.set(token, 0);
    });
    return tokenBalances;
  }

  async deposit(depositDto: DepositDTO) {
    const { username, token, amount, network } = depositDto;
    // Fetch user
    const user = await this.userModel.findOne({ username });
    if (!user) return;
    // Update balance
    let currentBalance = Number(user.wallet.get(token));
    currentBalance += Number(amount);
    user.wallet.set(token, Number(currentBalance));
    user.history.deposits.push({
      token,
      amount,
      network,
      status: conversionStatus.PENDING,
    });
    return user.save();
  }

  async withdraw(withdrawDto: WithdrawDTO) {
    const { username, token, amount, network } = withdrawDto;
    // Fetch user
    const user = await this.userModel.findOne({ username });
    if (!user) return;

    let balance = Number(user.wallet.get(token));
    // check if user has sufficient balance for this withdrawal
    if (Number(amount) > balance) {
      throw new BadRequestException('Insufficient funds for this operation');
    }
    balance -= Number(amount);
    user.wallet.set(token, Number(balance));
    user.history.withdrawals.push({
      token,
      amount,
      network,
      status: conversionStatus.PENDING,
    });
    return user.save();
  }

  async transfer(transferDto: TransferDTO) {
    const { userId, token, amount } = transferDto;
    // Fetch user
    const user = await this.userModel.findOne({ _id: userId });
    if (!user) return;

    let balance = Number(user.wallet.get(token));
    // check if user has sufficient balance for this withdrawal
    if (Number(amount) > balance) {
      throw new InsufficientFundsException();
    }
    balance -= Number(amount);
    user.wallet.set(token, Number(balance));
    return user.save();
  }

  async getExchangeRate(convertDto: ConvertDTO) {
    const { userId, baseToken, destinationToken, baseTokenAmount } = convertDto;
    // Check if baseToken amount is valid
    if (Number(baseTokenAmount) <= 0) {
      throw new BadRequestException('Invalid amount for conversion');
    }
    // Fetch user
    const user = await this.userModel.findOne({ _id: userId });
    if (!user) return;
    // Fetch balance of base token
    const baseTokenbalance = Number(user.wallet.get(baseToken));
    // check if user has sufficient balance for this conversion
    if (Number(baseTokenAmount) > baseTokenbalance) {
      throw new InsufficientFundsException();
    }
    // Fetch prices of base & destination tokens from coinGecko
    const currentPrices = await getCurrentPrices(
      `${TokenSymbols[baseToken]},${TokenSymbols[destinationToken]}`,
    );
    // Retrieve the returned values from returned data
    const baseTokenPrice = currentPrices[TokenSymbols[baseToken]].usd;
    const destinationTokenPrice =
      currentPrices[TokenSymbols[destinationToken]].usd;
    // Calculate exchange rate
    const destinationTokenAmount = calculateExchangeRate({
      baseTokenPrice,
      destinationTokenPrice,
      baseTokenAmount,
    });
    return {
      baseTokenPrice,
      destinationTokenPrice,
      destinationTokenAmount,
    };
  }

  async convert(convertDto: ConvertDTO) {
    const { userId, baseToken, destinationToken, baseTokenAmount } = convertDto;

    // Fetch user
    const user = await this.userModel.findOne({ _id: userId });
    if (!user) return;
    // Fetch Balances of both tokens
    let destinationTokenbalance = Number(user.wallet.get(destinationToken));
    let baseTokenbalance = Number(user.wallet.get(baseToken));
    // check if user has sufficient balance for this conversion
    if (Number(baseTokenAmount) > baseTokenbalance) {
      throw new InsufficientFundsException();
    }
    // Fetch amount of destination token
    const { destinationTokenAmount } = await this.getExchangeRate(convertDto);
    console.log(destinationTokenAmount);
    // Update wallet balances
    destinationTokenbalance += Number(destinationTokenAmount);
    user.wallet.set(destinationToken, destinationTokenbalance);

    baseTokenbalance -= Number(baseTokenAmount);
    user.wallet.set(baseToken, baseTokenbalance);
    user.history.conversions.push({
      baseToken,
      destinationToken,
      baseTokenAmount: baseTokenAmount.toString(),
      destinationTokenAmount,
      status: conversionStatus.COMPLETED,
    });
    return await user.save();
  }

  async setBalance(setBalanceDto: SetBalanceDto) {
    const { username, token, balance } = setBalanceDto;
    // Fetch user
    const user = await this.userModel.findOne({ username });
    if (!user) return;
    // Update balance
    const current_balance = Number(balance);
    user.wallet.set(token, Number(current_balance));
    return user.save();
  }
}
