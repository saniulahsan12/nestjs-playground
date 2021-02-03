import { UpdateLogDto } from './dto/update-log.dto';
import { Log } from './schemas/log.schema';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateLogDto } from './dto/create-log.dto';
import { LogsService } from './logs.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { DeleteResult } from 'typeorm';
import { ObjectId } from 'mongoose';
import {
  ApiBadGatewayResponse,
  ApiOkResponse,
  ApiParam,
} from '@nestjs/swagger';

@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get()
  findAll() {
    return this.logsService.findAll();
  }

  @ApiParam({ name: 'id' })
  @ApiBadGatewayResponse({
    status: 400,
    description: 'There is a error in the response',
  })
  @ApiOkResponse({
    status: 201,
    description: 'The record has been successfully created.',
  })
  @Get(':id')
  findOne(@Param('id') id: ObjectId): Promise<Log> {
    return this.logsService.findOne(id);
  }

  @Get('/user/:id')
  findUserLogs(@Param('id') id: number) {
    return this.logsService.logsByUserId(id);
  }

  @Post('/add')
  @UseGuards(JwtAuthGuard)
  createLog(@Req() req, @Body() createLogDto: CreateLogDto): Promise<Log> {
    createLogDto.ip = req.ip;
    createLogDto.userId = req.user.userId || null;
    return this.logsService.create(createLogDto);
  }

  @Post('/update/:id')
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id' })
  updateLog(
    @Param('id') id: ObjectId,
    @Body() updateLogDto: UpdateLogDto,
  ): Promise<Log> {
    return this.logsService.update(id, updateLogDto);
  }

  @Delete('/delete/:id')
  @ApiParam({ name: 'id' })
  @UseGuards(JwtAuthGuard)
  deleteLog(@Param('id') id: ObjectId): Promise<DeleteResult> {
    return this.logsService.delete(id);
  }
}
