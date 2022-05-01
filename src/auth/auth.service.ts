import { VerifyDto } from './dtos/verify.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from '../users/dto/sign-up.dto';
import { Users, UsersDocument } from '../users/schema/users.schema';
import { VCode, VCodeDocument } from '../users/schema/vCode.schema';
import { CodeStatus } from './enums/codeStatus.enum';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectModel(Users.name) private usersModel: Model<UsersDocument>,
    @InjectModel(VCode.name) private vtokenModel: Model<VCodeDocument>,
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
    const code = await this.vtokenModel.findOne({
      value: verifyDTO.verificationCode,
    });
    if (code && code.username === user.username) {
      // Change code status to 'Verified'
      code.status = CodeStatus.VERIFIED;
      // Change user status to email verified
      user.emailVerified = true;
      await Promise.all([user.save(), code.save()]);
      return {
        status: code.status,
      };
    }
    return {
      status: 'Failed',
    };
  }
}
