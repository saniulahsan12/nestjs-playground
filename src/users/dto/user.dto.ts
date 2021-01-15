import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class UserDTO {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  password: string;
}
