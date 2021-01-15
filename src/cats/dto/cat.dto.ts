import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CatDTO {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  gender: string;
}
