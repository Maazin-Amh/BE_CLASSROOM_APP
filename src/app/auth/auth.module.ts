import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtModule } from '@nestjs/jwt';
import { JwtAccessTokenStrategy } from './jwtAccessToken.strategy';
import { JwtRefreshTokenStrategy } from './jwtRefreshToken.strategy';
import { Admins } from './auth.entity';
import { ResetPassword } from '../mail/reset_password.entity';
import { MailService } from '../mail/mail.service';
import { AuthService } from './auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admins, ResetPassword]),
    JwtModule.register({ signOptions: { expiresIn: '365h' } }),
  ],
  controllers: [AuthController],
  providers: [
    MailService,
    JwtAccessTokenStrategy,
    JwtRefreshTokenStrategy,
    AuthService,
  ],
})
export class AuthModule {}
