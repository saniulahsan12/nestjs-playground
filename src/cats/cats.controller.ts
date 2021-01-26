import { Users } from './../users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Body,
  Controller,
  Get,
  Put,
  Param,
  NotFoundException,
  Post,
  Delete,
  UseGuards,
  Req,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';

import { Cats } from './cat.entity';

import { CatDTO } from './dto/cat.dto';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ClassSerializerInterceptor } from '@nestjs/common/serializer';

@Controller('cats')
@UseInterceptors(ClassSerializerInterceptor)
export class CatsController {
  constructor(
    @InjectRepository(Cats)
    private catsRepository: Repository<Cats>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  @Get('/')
  async getCats(): Promise<CatDTO[]> {
    return await this.catsRepository.find({ relations: ['user'] });
  }

  @Get('/user/:id')
  async getUsersCat(@Param('id') id: number): Promise<Users> {
    return await this.usersRepository.findOne({
      where: {
        id: id,
      },
      relations: ['cats'],
    });
  }

  @Get(':id')
  async getCat(@Param('id') id: number): Promise<CatDTO | NotFoundException> {
    const singleCat = await this.catsRepository.findOne({
      where: { id: id },
      relations: ['user'],
    });
    if (!singleCat) {
      return new NotFoundException();
    }
    return singleCat;
  }

  @Put(':id')
  async updateCat(
    @Param('id') id: number,
    @Body() catDto: CatDTO,
  ): Promise<UpdateResult> {
    return await this.catsRepository.update(Number(id), catDto);
  }

  @Post('/')
  @UseGuards(JwtAuthGuard)
  async addCat(@Req() req, @Body() catDto: CatDTO): Promise<Cats> {
    const cat = new Cats();
    cat.name = catDto.name;
    cat.gender = catDto.gender;
    cat.user = await this.usersRepository.findOne({ id: req.user.userId });
    return this.catsRepository.save(cat);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async removeCat(
    @Req() req,
    @Param('id') id: number,
  ): Promise<DeleteResult | UnauthorizedException | NotFoundException> {
    const existingCat = await this.catsRepository.findOne({
      where: { id: id },
      relations: ['user'],
    });
    if (!existingCat) {
      return new NotFoundException();
    }

    if (existingCat.user.id === req.user.userId) {
      return await this.catsRepository.delete(id);
    } else {
      return new UnauthorizedException();
    }
  }
}
