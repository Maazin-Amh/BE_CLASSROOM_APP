import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { ClassModule } from './app/class/class.module';
import { AuthModule } from './app/auth/auth.module';
import { ProfileModule } from './app/profile/profile.module';
import { TugasModule } from './app/tugas/tugas.module';
import { PengumpulanModule } from './app/pengumpulan/pengumpulan.module';
import { UploadController } from './app/upload/upload.controller';
import { MailModule } from './app/mail/mail.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),

    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    ClassModule,
    MailModule,
    ProfileModule,
    TugasModule,
    PengumpulanModule,
  ],
  controllers: [AppController, UploadController],
  providers: [AppService],
  exports: [],
})
export class AppModule {}
