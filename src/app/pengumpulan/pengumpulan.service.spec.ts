import { Test, TestingModule } from '@nestjs/testing';
import { PengumpulanService } from './pengumpulan.service';

describe('PengumpulanService', () => {
  let service: PengumpulanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PengumpulanService],
    }).compile();

    service = module.get<PengumpulanService>(PengumpulanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
