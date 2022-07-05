import { Module } from '@nestjs/common';
import { AnyrunService } from './anyrun.service';
import { AnyrunController } from './anyrun.controller';

@Module({
  controllers: [AnyrunController],
  providers: [AnyrunService],
})
export class AnyrunModule {}
