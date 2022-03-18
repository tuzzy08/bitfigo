import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('admin')
export class AdminController {
  // @UseGuards(JwtAuthGuard)
  @Get()
  // @Roles(Role.Admin)
  get() {
    return 'Hello Admin';
  }
}
