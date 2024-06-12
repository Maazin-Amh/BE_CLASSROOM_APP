import { Test, TestingModule } from '@nestjs/testing';
import { ProfileSiswaService } from './profile.service';

describe('ProfileSiswaService', () => {
  let service: ProfileSiswaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProfileSiswaService],
    }).compile();

    service = module.get<ProfileSiswaService>(ProfileSiswaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
