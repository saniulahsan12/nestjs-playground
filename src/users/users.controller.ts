import { UserDTO } from './dto/user.dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { InsertResult, Repository } from 'typeorm';
import { Users } from './user.entity';
import * as bcrypt from 'bcrypt';
import { hashConstants } from '../auth/constants';

@Controller('users')
export class UsersController {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  @Post('/add')
  // @UseGuards(JwtAuthGuard)
  async addCat(@Body() userDto: UserDTO): Promise<Users | InsertResult> {
    userDto.password = await bcrypt.hash(
      userDto.password,
      hashConstants.saltRound,
    );
    return await this.usersRepository.insert(userDto);
  }
}
