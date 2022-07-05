import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class Index extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  search_field: string;

  @Prop({ required: true })
  path: string;

  @Prop({ required: true })
  title: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: 'User',
  })
  created_by: ObjectId;
}

export const IndexSchema = SchemaFactory.createForClass(Index);
