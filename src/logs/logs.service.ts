import { DeleteResult } from 'typeorm';
import { Model, ObjectId } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Log, LogDocument } from './schemas/log.schema';
import { CreateLogDto } from './dto/create-log.dto';
import { UpdateLogDto } from './dto/update-log.dto';

@Injectable()
export class LogsService {
  constructor(@InjectModel(Log.name) private logModel: Model<LogDocument>) {}

  async findAll(): Promise<Log[]> {
    return await this.logModel.find();
  }

  async findOne(id: ObjectId): Promise<Log> {
    try {
      return await this.logModel.findOne({
        _id: id,
      });
    } catch (error) {
      return error;
    }
  }

  async logsByUserId(userId): Promise<Log[]> {
    try {
      return await this.logModel.aggregate([
        { $match: { userId: parseInt(userId) } },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: 'nid',
            as: 'userDetails',
          },
        },
      ]);
    } catch (error) {
      return error;
    }
  }

  async create(createLogDto: CreateLogDto): Promise<Log> {
    createLogDto.time = new Date();
    createLogDto.status = 200;
    return await this.logModel.create(createLogDto);
  }

  async update(id: ObjectId, updateLogDto: UpdateLogDto): Promise<Log> {
    try {
      return await this.logModel.updateOne({ _id: id }, updateLogDto);
    } catch (error) {
      return error;
    }
  }

  async delete(id: ObjectId): Promise<DeleteResult> {
    try {
      return await this.logModel.deleteOne({
        _id: id,
      });
    } catch (error) {
      return error;
    }
  }
}
