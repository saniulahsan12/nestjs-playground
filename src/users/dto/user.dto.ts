import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';
export class UserDTO {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  username: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  password: string;
}
