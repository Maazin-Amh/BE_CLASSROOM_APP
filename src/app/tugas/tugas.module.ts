import { Module } from '@nestjs/common';
import { TugasController } from './tugas.controller';
import { TugasService } from './tugas.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tugas } from './tugas.entity';
import { Class } from '../class/class.entity';
import { Admins } from '../auth/auth.entity';
import { Pengumpulan } from '../pengumpulan/pengumpulan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tugas, Class, Admins, Pengumpulan])],
  controllers: [TugasController],
  providers: [TugasService],
})
export class TugasModule {}
