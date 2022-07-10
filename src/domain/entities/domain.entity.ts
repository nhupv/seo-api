import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema({ timestamps: true, versionKey: false })
export class Domain extends Document {
  @Prop({ required: true, unique: true })
  auctionId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ default: null })
  endTime: string;

  @Prop({ type: String })
  winning: string;

  @Prop({ default: null })
  highBid: string;

  @Prop({ default: null })
  maxBid: string;

  @Prop({ default: null })
  numberOfBidders: number;

  @Prop({ default: null })
  highestBidder: number;

  @Prop({ default: null })
  minimumNextBid: number;

  @Prop({ default: null })
  bidIncrement: number;

  @Prop({ default: null })
  type: string;

  @Prop({ type: Number, required: false, select: false })
  __v: number;

  constructor(partial: Partial<Domain>) {
    super();
    Object.assign(this, partial);
  }
}

export const DomainSchema = SchemaFactory.createForClass(Domain);
