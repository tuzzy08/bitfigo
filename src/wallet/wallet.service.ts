import { Injectable, BadRequestException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ConvertDTO, DepositDTO, TransferDTO, WithdrawDTO } from './dto';
import { Wallet, WalletDocument } from './schemas/wallet.schema';
import { tokens, TokenSymbols } from '../utils/tokens';
import { InsufficientFundsException } from './wallet-exception';
import {
  getCurrentPrices,
  calculateExchangeRate,
} from '../utils/coingecko-api';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel(Wallet.name) private walletModel: Model<WalletDocument>,
  ) {}

  async createWallet(ownerID) {
    // Check if wallet exists
    const existingWallet = await this.walletModel.findOne({ owner: ownerID });
    if (existingWallet)
      throw new BadRequestException('A wallet already exists for this user');
    // Create new wallet for the user
    const tokenBalances = new Map();
    tokens.map((token) => {
      tokenBalances.set(token, 0);
    });
    const wallet = new this.walletModel();
    wallet.owner = ownerID;
    wallet.balances = tokenBalances;
    const { _id } = await wallet.save();
    return _id;
  }

  async deposit(depositDto: DepositDTO) {
    const { userId: ownerId, token, amount } = depositDto;
    // Fetch user wallet
    const wallet = await this.walletModel.findOne({ owner: ownerId });
    if (!wallet) return;

    let currentBalance = Number(wallet.balances.get(token));
    currentBalance += Number(amount);
    wallet.balances.set(token, Number(currentBalance));
    return wallet.save();
  }

  async withdraw(withdrawDto: WithdrawDTO) {
    const { userId: ownerId, token, amount } = withdrawDto;
    // Fetch user wallet
    const wallet = await this.walletModel.findOne({ owner: ownerId });
    if (!wallet) return;
    let balance = Number(wallet.balances.get(token));
    // check if user has sufficient balance for this withdrawal
    if (amount > balance) {
      throw new InsufficientFundsException();
    }
    balance -= Number(amount);
    wallet.balances.set(token, Number(balance));
    return wallet.save();
  }

  async transfer(transferDto: TransferDTO) {
    return transferDto;
  }

  async convert(convertDto: ConvertDTO) {
    const {
      userId: ownerId,
      baseToken,
      destinationToken,
      baseTokenAmount,
    } = convertDto;
    // Check if baseToken amount is valid
    if (baseTokenAmount <= 0) {
      throw new BadRequestException('Invalid amount for conversion');
    }
    // Fetch user's wallet
    const wallet = await this.walletModel.findOne({ owner: ownerId });
    if (!wallet) return;
    const baseTokenbalance = Number(wallet.balances.get(baseToken));
    // check if user has sufficient balance for this conversion
    if (baseTokenAmount > baseTokenbalance) {
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

    return calculateExchangeRate({
      baseTokenPrice,
      destinationTokenPrice,
      baseTokenAmount,
    });
  }
}
