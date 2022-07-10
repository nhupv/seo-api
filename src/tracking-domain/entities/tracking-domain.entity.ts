import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class TrackingDomain extends Document {
  @Prop({ required: true })
  domain: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  name: string;

  constructor(partial: Partial<TrackingDomain>) {
    super();
    Object.assign(this, partial);
  }
}

export const TrackingDomainSchema = SchemaFactory.createForClass(
  TrackingDomain,
);
