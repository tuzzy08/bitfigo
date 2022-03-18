import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
  @ApiProperty()
  fullName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  mobile: string;

  @ApiProperty()
  cryptoAddress: string;
}
