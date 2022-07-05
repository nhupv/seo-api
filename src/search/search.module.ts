import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { IndexsModule } from 'src/indexs/indexs.module';

@Module({
  imports: [IndexsModule],
  providers: [SearchService],
  controllers: [SearchController],
})
export class SearchModule {}
