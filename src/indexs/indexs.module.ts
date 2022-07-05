import { Module } from '@nestjs/common';
import { IndexsService } from './indexs.service';
import { IndexsController } from './indexs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { IndexSchema } from './entities/index.entity';
import { IndexCommand } from './commands/indexs.command';
import { ConsoleModule } from 'nestjs-console';
import { TestCreateCveCommand } from './commands/testCreateCve.command';

@Module({
  imports: [
    ConsoleModule,
    MongooseModule.forFeature([{ name: 'Index', schema: IndexSchema }]),
  ],
  controllers: [IndexsController],
  providers: [IndexsService, IndexCommand, TestCreateCveCommand],
  exports: [IndexsService],
})
export class IndexsModule {}
