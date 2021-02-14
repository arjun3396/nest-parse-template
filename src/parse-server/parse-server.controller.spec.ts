import { Test, TestingModule } from '@nestjs/testing';
import { ParseServerController } from './parse-server.controller';

describe('ParseServerController', () => {
  let controller: ParseServerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParseServerController],
    }).compile();

    controller = module.get<ParseServerController>(ParseServerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
