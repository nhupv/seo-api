import { Test, TestingModule } from '@nestjs/testing';
import { IndexsController } from './indexs.controller';
import { IndexsService } from './indexs.service';

describe('IndexsController', () => {
  let controller: IndexsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IndexsController],
      providers: [IndexsService],
    }).compile();

    controller = module.get<IndexsController>(IndexsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
