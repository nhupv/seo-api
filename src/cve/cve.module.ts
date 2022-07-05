import { Module } from '@nestjs/common';

import { CveService } from './cve.service';
import { CveController } from './cve.controller';
import { PostsModule } from 'src/posts/posts.module';
@Module({
  imports: [PostsModule],
  providers: [CveService],
  exports: [CveService],
  controllers: [CveController],
})
export class CveModule {}
