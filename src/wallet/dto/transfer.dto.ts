import { ApiProperty } from '@nestjs/swagger';

export class TransferDTO {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  token: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  commission: string;

  @ApiProperty()
  receiverId: string;
}
