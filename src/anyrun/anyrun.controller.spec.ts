import { Test, TestingModule } from '@nestjs/testing';
import { AnyrunController } from './anyrun.controller';
import { AnyrunService } from './anyrun.service';

describe('AnyrunController', () => {
  let controller: AnyrunController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnyrunController],
      providers: [AnyrunService],
    }).compile();

    controller = module.get<AnyrunController>(AnyrunController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
