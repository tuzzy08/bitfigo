import { ApiProperty } from '@nestjs/swagger';

export class ConvertDTO {
  // This annotation populates these properties
  // on the swagger documentation endpoint as it
  // doesn't populate by default
  @ApiProperty()
  userId: string;

  @ApiProperty()
  baseToken: string;

  @ApiProperty()
  destinationToken: string;

  @ApiProperty()
  baseTokenAmount: number;
}
