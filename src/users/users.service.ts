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

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private usersModel: Model<UsersDocument>,
    @Inject(forwardRef(() => WalletService))
    private walletService: WalletService,
  ) {}
  async signUp(signupDto: SignUpDto) {
    if (!signupDto) throw new BadRequestException('No signup data provided');
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

  async getUser(email) {
    if (!email) throw new BadRequestException('No email provided');
    // ToObject returns the document as a javascript object
    const user = await this.usersModel.findOne({ email });
    if (!user) throw new NotFoundException('User not found');
    return user.toObject();
  }
}
