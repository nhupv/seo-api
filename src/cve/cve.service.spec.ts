import { Test, TestingModule } from '@nestjs/testing';
import { CveService } from './cve.service';

describe('CveService', () => {
  let service: CveService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CveService],
    }).compile();

    service = module.get<CveService>(CveService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
