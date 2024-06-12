import { Module } from '@nestjs/common';
import { PengumpulanController } from './pengumpulan.controller';
import { PengumpulanService } from './pengumpulan.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tugas } from '../tugas/tugas.entity';
import { Pengumpulan } from './pengumpulan.entity';
import { Admins } from '../auth/auth.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tugas, Pengumpulan, Admins])],
  controllers: [PengumpulanController],
  providers: [PengumpulanService],
})
export class PengumpulanModule {}
