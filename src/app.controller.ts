import {
  Body,
  Controller,
  Get,
  Request,
  Post,
  Query,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { SignUpDto } from './users/dto/sign-up.dto';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { AuthService } from './auth/auth.service';
import { UsersService } from './users/users.service';

@Controller()
export class AppController {
  constructor(
    private readonly authService: AuthService,
    private usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get('/api/health/')
  async health() {
    return { status: 'oki doki' };
  }

  @Post('auth/signup')
  async signup(@Body() signupDTO: SignUpDto) {
    return this.authService.signUp(signupDTO);
  }

  @UseGuards(JwtAuthGuard)
  @Get('users')
  async getUser(@Query() query) {
    if (query?.username) {
      return this.usersService.getUser(query?.username);
    }
    // throw new BadRequestException('No username provided');
    return query;
  }
}
