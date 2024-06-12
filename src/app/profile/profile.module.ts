import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admins } from '../auth/auth.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Admins])],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
