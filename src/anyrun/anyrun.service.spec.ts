import { Test, TestingModule } from '@nestjs/testing';
import { AnyrunService } from './anyrun.service';

describe('AnyrunService', () => {
  let service: AnyrunService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnyrunService],
    }).compile();

    service = module.get<AnyrunService>(AnyrunService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
