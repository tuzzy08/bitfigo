import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ResetDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  PasswordResetToken: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
