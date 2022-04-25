import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from '../users/dto/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
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
    const user = await this.usersService.signUp(signupDTO);
    const payload = { username: user.username, sub: user._id };
    return {
      accessToken: this.jwtService.sign(payload),
      user,
    };
  }
}
