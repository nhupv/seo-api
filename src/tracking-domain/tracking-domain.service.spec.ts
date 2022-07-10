import { Test, TestingModule } from '@nestjs/testing';
import { TrackingDomainService } from './tracking-domain.service';

describe('TrackingDomainService', () => {
  let service: TrackingDomainService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrackingDomainService],
    }).compile();

    service = module.get<TrackingDomainService>(TrackingDomainService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
