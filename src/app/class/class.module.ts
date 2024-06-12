import { Module } from '@nestjs/common';
import { ClassController } from './class.controller';
import { ClassService } from './class.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Class } from './class.entity';
import { Admins } from '../auth/auth.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Class, Admins])],
  controllers: [ClassController],
  providers: [ClassService],
})
export class ClassModule {}
