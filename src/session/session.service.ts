import { Injectable } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session } from './entities/session.entity';

@Injectable()
export class SessionService {
  constructor(
    @InjectModel('Session') private readonly sessionModel: Model<Session>,
  ) {}
  create(createSessionDto: CreateSessionDto) {
    const createSession = new this.sessionModel(createSessionDto);
    return createSession.save();
  }

  async findOneBySession(sessionId: string): Promise<Session> {
    return await this.sessionModel.findOne({ session_id: sessionId }).exec();
  }

  update(id: number, updateSessionDto: UpdateSessionDto) {
    return `This action updates a #${id} session`;
  }

  async remove(sessionId: string) {
    return this.sessionModel.deleteOne({ session_id: sessionId });
  }
}
