import { Test, TestingModule } from '@nestjs/testing';
import { IndexsService } from './indexs.service';

describe('IndexsService', () => {
  let service: IndexsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IndexsService],
    }).compile();

    service = module.get<IndexsService>(IndexsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
