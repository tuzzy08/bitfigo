import { HttpException } from '@nestjs/common';

export class InsufficientFundsException extends HttpException {
  constructor() {
    super('Insufficient funds for this operation', 500);
  }
}
