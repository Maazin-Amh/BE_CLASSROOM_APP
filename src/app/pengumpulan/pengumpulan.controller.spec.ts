import { Test, TestingModule } from '@nestjs/testing';
import { PengumpulanController } from './pengumpulan.controller';

describe('PengumpulanController', () => {
  let controller: PengumpulanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PengumpulanController],
    }).compile();

    controller = module.get<PengumpulanController>(PengumpulanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
