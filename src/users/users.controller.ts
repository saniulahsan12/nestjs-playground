import { UserDTO } from './dto/user.dto';
import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
import { Users } from './user.entity';
import * as bcrypt from 'bcrypt';
import { hashConstants } from '../auth/constants';
import { ClassSerializerInterceptor } from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  @Post('/add')
  // @UseGuards(JwtAuthGuard)
  async addUser(@Body() userDto: UserDTO): Promise<Users | InsertResult> {
    userDto.password = await bcrypt.hash(
      userDto.password,
      hashConstants.saltRound,
    );
    return await this.usersRepository.insert(userDto);
  }

  @Get('/')
  @UseInterceptors(ClassSerializerInterceptor)
  async getUsers(): Promise<UserDTO[]> {
    return await this.usersRepository.find();
  }
}
