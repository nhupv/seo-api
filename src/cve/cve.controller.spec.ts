import { Test, TestingModule } from '@nestjs/testing';
import { CveController } from './cve.controller';

describe('CveController', () => {
  let controller: CveController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CveController],
    }).compile();

    controller = module.get<CveController>(CveController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
