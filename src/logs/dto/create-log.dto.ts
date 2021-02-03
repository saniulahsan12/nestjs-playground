import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsDate,
  IsOptional,
} from 'class-validator';

export class CreateLogDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsDate()
  @IsOptional()
  time: Date;

  @IsString()
  @IsOptional()
  ip: string;

  @IsNumber()
  @IsOptional()
  userId: number;

  @IsNumber()
  @IsOptional()
  status: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  message: string;
}
