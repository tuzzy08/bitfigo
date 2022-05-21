import { UsersService } from './../users/users.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminService {
  constructor(private usersServce: UsersService) {}

  async getAllUsers() {
    try {
      return await this.usersServce.getAllUsers();
    } catch (error) {
      throw error;
    }
  }

  async getUser(username) {
    try {
      return await this.usersServce.getUser(username);
    } catch (error) {
      throw error;
    }
  }
}
