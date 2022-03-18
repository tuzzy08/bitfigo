import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ConvertDTO {
  // This annotation populates these properties
  // on the swagger documentation endpoint as it
  // doesn't populate by default
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  userId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  baseToken: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  destinationToken: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  baseTokenAmount: number;
}
