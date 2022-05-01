import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  verificationCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string;
}
