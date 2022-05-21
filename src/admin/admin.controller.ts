import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminService } from './admin.service';
import { WalletService } from '../wallet/wallet.service';
import { SetBalanceDto } from './dtos/setBalance.dto';

@Controller('admin')
export class AdminController {
  constructor(
    private adminService: AdminService,
    private walletService: WalletService,
  ) {}
  @UseGuards(JwtAuthGuard)
  @Get()
  @Roles(Role.Admin)
  get() {
    return 'Hello Admin';
  }

  @Get('users')
  getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Get('users/:username')
  getUser(@Param() params) {
    const username = params?.username;
    return this.adminService.getUser(username);
  }

  @Post('users/setBalance')
  setBalance(@Body() setBalanceDTO: SetBalanceDto) {
    return this.walletService.setBalance(setBalanceDTO);
  }

  // reduceBalance() {}

  // suspendUser() {}

  // deleteUser() {}
}
