import { ResetDto } from './dtos/reset.dto';
import { VerifyDto } from './dtos/verify.dto';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from '../users/dto/sign-up.dto';
import { Users, UsersDocument } from '../users/schema/users.schema';
import { Token, TokenDocument } from '../users/schema/tokens.schema';
import { generateCode } from '../utils/generateCode';
import { TokenType } from '../users/enums/tokenType.enum';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectModel(Users.name) private usersModel: Model<UsersDocument>,
    // @InjectModel(VCode.name) private vtokenModel: Model<VCodeDocument>,
    @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.getUser(username);
    if (!user) throw new NotFoundException();
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (user && isValidPassword) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.email, sub: user._id };
    const authenticatedUser = {
      ...user,
    };
    authenticatedUser.accessToken = this.jwtService.sign(payload);
    return authenticatedUser;
  }

  async signUp(signupDTO: SignUpDto) {
    const { user, verificationCode } = await this.usersService.signUp(
      signupDTO,
    );
    const payload = { username: user.username, sub: user._id };
    return {
      accessToken: this.jwtService.sign(payload),
      user,
      verificationCode,
    };
  }

  async verify(verifyDTO: VerifyDto) {
    // fetch user
    const user = await this.usersModel.findOne({
      username: verifyDTO.username,
    });
    if (!user) throw new NotFoundException();
    // Get verification code
    const code = await this.tokenModel.findOne({
      value: verifyDTO.verificationCode,
    });

    if (code && code.username === user.username) {
      // Change code status to 'Verified'
      // code.status = CodeStatus.VERIFIED;
      // Change user status to email verified
      user.emailVerified = true;
      await user.save();
      return {
        status: 'Verified',
      };
    }
    return {
      status: 'Failed',
    };
  }

  async generatePasswordResetToken(username: string) {
    // Validate the user
    const user = await this.usersService.getUser(username);
    if (!user) throw new NotFoundException();
    // Check if there's an existing token & delete it
    await this.tokenModel.findOneAndDelete({ username });
    // Generate password reset token
    const tk = generateCode();
    const token = new this.tokenModel({
      username,
      type: TokenType.RESET,
      value: tk,
    });
    await token.save();

    return { username, token: tk };
  }

  async reset(resetDTO: ResetDto) {
    const { PasswordResetToken, newPassword } = resetDTO;
    // Validate Password Reset Token
    const token = await this.tokenModel.findOne({ value: PasswordResetToken });
    const username = token.username;
    const tokenExpiryTime = token.expiresAt.getTime();
    const currentTime = new Date().getTime();

    // Check if token is valid
    if (token.value !== PasswordResetToken) {
      throw new BadRequestException(
        'This link has expired or the link is invalid',
      );
    }
    // Delete the token
    const res = await this.tokenModel.findOneAndDelete({ _id: token._id });
    if (res) {
      // Reset the user's password
      const user = await this.usersModel.findOne({ username });
      if (!user) throw new NotFoundException();

      const passwordHash = await bcrypt.hash(newPassword, 10);
      user.passwordHash = passwordHash;
      await user.save();
      return {
        status: 'success',
        message: 'Password reset succesfully',
      };
    }
  }

  async getToken(token: string) {
    const userToken = await this.tokenModel.findOne({ value: token }).lean();
    if (userToken) {
      return true;
    }
    return false;
  }

  async getTokenByUser(username: string) {
    const userToken = await this.tokenModel.findOne({ username }).lean();
    if (userToken) {
      return userToken.value;
    }
    return false;
  }
}
