import { Test, TestingModule } from '@nestjs/testing';
import { TrackingDomainController } from './tracking-domain.controller';
import { TrackingDomainService } from './tracking-domain.service';

describe('TrackingDomainController', () => {
  let controller: TrackingDomainController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrackingDomainController],
      providers: [TrackingDomainService],
    }).compile();

    controller = module.get<TrackingDomainController>(TrackingDomainController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
