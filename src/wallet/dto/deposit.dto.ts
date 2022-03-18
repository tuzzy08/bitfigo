import { ApiProperty } from '@nestjs/swagger';

export class DepositDTO {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  token: string;

  @ApiProperty()
  network: string;

  @ApiProperty()
  amount: number;
}
