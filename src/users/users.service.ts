import {
  Injectable,
  BadRequestException,
  NotFoundException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Users, UsersDocument } from './schema/users.schema';
import { SignUpDto } from './dto/sign-up.dto';
import { WalletService } from '../wallet/wallet.service';
import { sign } from 'crypto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private usersModel: Model<UsersDocument>,
    @Inject(forwardRef(() => WalletService))
    private walletService: WalletService,
  ) {}
  async signUp(signupDto: SignUpDto) {
    if (!signupDto) throw new BadRequestException('No signup data provided');
    // Check if user already exists
    const user = await this.getUser(signupDto.username);
    if (user) throw new BadRequestException('User with this email exists!');

    const salt = 10;
    const { password, ...rest } = signupDto;
    const passwordHash = await bcrypt.hash(password, salt);
    const payload = { ...rest, passwordHash };
    const newUser = await new this.usersModel(payload);
    // Initialize wallet and balances
    const wallet = this.walletService.createWallet();
    newUser.wallet = wallet;
    return newUser.save();
  }

  async getUser(username) {
    if (!username) throw new BadRequestException('No email provided');
    // ToObject returns the document as a javascript object
    const user = await this.usersModel.findOne({ email: username });
    if (user) {
      return user.toObject();
    }
  }
}
