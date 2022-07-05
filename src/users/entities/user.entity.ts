import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { classToPlain, Exclude, Expose, Transform } from 'class-transformer';
import { IsEmail, IsOptional } from 'class-validator';
import { Document, ObjectId } from 'mongoose';
import { Role } from 'src/roles/role.enum';

@Schema({ timestamps: true, versionKey: false })
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  username: string;

  @Prop({ default: 20 })
  age: number;

  @Prop({ type: String, select: false, required: true })
  @Exclude()
  password: string;

  @Prop({ required: true })
  roles: Role[];

  @Prop({ default: null })
  fido_user: string;

  @Prop({ type: Number, required: false, select: false })
  __v: number;

  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
