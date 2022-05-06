import {
  Body,
  Controller,
  Get,
  Request,
  Post,
  Put,
  Query,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { VerifyDto } from './dtos/verify.dto';
import { SignUpDto } from '../users/dto/sign-up.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { ResetDto } from './dtos/reset.dto';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('signup')
  async signup(@Body() signupDTO: SignUpDto) {
    return this.authService.signUp(signupDTO);
  }

  @Post('verify')
  async verify(@Body() verifyDTO: VerifyDto) {
    console.log(verifyDTO);
    return this.authService.verify(verifyDTO);
  }

  @Post('generatePasswordResetToken')
  async generatePasswordResetToken(@Body() body) {
    console.log(body);
    return this.authService.generatePasswordResetToken(body.username);
  }

  @Post('getToken')
  async getToken(@Body() body) {
    const { token } = body;
    return this.authService.getToken(token);
  }

  @Post('getTokenByUser')
  async getTokenByUser(@Body() body) {
    const { username } = body;
    return this.authService.getTokenByUser(username);
  }

  @Put('reset')
  async reset(@Body() resetDTO: ResetDto) {
    return this.authService.reset(resetDTO);
  }
}
