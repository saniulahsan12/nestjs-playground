import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LogDocument = Log & Document;

@Schema()
export class Log {
  @Prop()
  name: string;

  @Prop()
  time: Date;

  @Prop()
  ip: string;

  @Prop()
  userId: number;

  @Prop()
  status: number;

  @Prop()
  message: string;
}

export const LogSchema = SchemaFactory.createForClass(Log);
