import { Body, Controller, Request, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { SignUpDto } from './users/dto/sign-up.dto';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('auth/signup')
  async signup(@Body() signupDTO: SignUpDto) {
    return this.usersService.signUp(signupDTO);
  }
}
