import { ApiProperty } from '@nestjs/swagger';
export class WithdrawDTO {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  token: string;

  @ApiProperty()
  network: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  address: string;
}
