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

import * as couchbase from 'couchbase';

@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get()
  async findAll() {
    return this.logsService.findAll();
  }

  @Get('/couchbase')
  async findAllCouchbase() {

    const cluster = await couchbase.connect("couchbase://localhost", {
      username: "recipe_user",
      password: "recipe_user",
    });
    const bucket = cluster.bucket("travel-sample");
    const scope = bucket.scope("inventory");
    const collection = scope.collection("airport");

    // const collection = bucket.defaultCollection();
    // return await collection.get("user:king_luther");

    // const resultCol = await cluster.query('SELECT * FROM `travel-sample` route order by id desc limit 100');
    // const resultCol = await cluster.query('SELECT DISTINCT route.destinationairport FROM `travel-sample` airport JOIN `travel-sample` route ON airport.faa = route.sourceairport AND route.type = "route" WHERE airport.type = "airport" AND airport.city = "San Francisco" AND airport.country = "United States";');
    // return resultCol.rows;

    const result = await collection.get('airport_1254');
    return result;
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
