import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class Session extends Document {
  @Prop({ required: true })
  session_id: string;

  @Prop({ required: true })
  state: string;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
