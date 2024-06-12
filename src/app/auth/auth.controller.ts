/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  UseGuards,
  Get,
  Param,
  Put,
} from '@nestjs/common';
import { JwtGuard, JwtGuardRefreshToken } from './auth.guard';
import { LoginDto, RegisterDto, ResetPasswordDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private adminsService: AuthService) {}

  @Post('register')
  async register(@Body() payload: RegisterDto) {
    return this.adminsService.register(payload);
  }

  @Post('login')
  async login(@Body() payload: LoginDto) {
    return this.adminsService.login(payload);
  }

  @UseGuards(JwtGuard)
  @Get('profile')
  async profile(@Req() req) {
    const { id } = req.user;
    return this.adminsService.Profile(id);
  }

  @UseGuards(JwtGuardRefreshToken)
  @Get('refresh-token')
  async refreshToken(@Req() req) {
    const token = req.headers.authorization.split(' ')[1];
    const id = req.headers.id;
    return this.adminsService.RefreshToken(+id, token);
  }

  @Post('lupa-password')
  async forgotPassowrd(@Body('email') email: string) {
    console.log('email', email);
    return this.adminsService.forgotPassword(email);
  }

  @Post('reset-password/:admins_id/:token')
  async resetPassword(
    @Param('admins_id') admins_id: string,
    @Param('token') token: string,
    @Body() payload: ResetPasswordDto,
  ) {
    return this.adminsService.resetPassword(+admins_id, token, payload);
  }
}
