import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';
import { Exclude } from 'class-transformer';
export class UserDTO {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  @Exclude()
  password: string;

  constructor(partial: Partial<UserDTO>) {
    Object.assign(this, partial);
  }
}
