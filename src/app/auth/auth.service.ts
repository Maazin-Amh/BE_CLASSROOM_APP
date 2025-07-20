import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BaseResponse from 'src/utils/response/base.response';
import { LoginDto, RegisterDto, ResetPasswordDto } from './auth.dto';
import { ResponseSuccess } from 'src/interface';
import { JwtService } from '@nestjs/jwt';
import { jwt_config } from 'src/config/jwt.config';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import { compare, hash } from 'bcrypt';
import { MailService } from '../mail/mail.service';
import { ResetPassword } from '../mail/reset_password.entity';
import { Admins } from './auth.entity';

@Injectable()
export class AuthService extends BaseResponse {
  constructor(
    @InjectRepository(Admins)
    private readonly adminsRepository: Repository<Admins>,
    @InjectRepository(ResetPassword)
    private readonly resetPasswordRepository: Repository<ResetPassword>,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {
    super();
  }

  async register(payload: RegisterDto): Promise<ResponseSuccess> {
    const checkGuruExists = await this.adminsRepository.findOne({
      where: {
        username: payload.username,
      },
    });

    if (checkGuruExists) {
      throw new HttpException('User already registered', HttpStatus.FOUND);
    }

    payload.password = await hash(payload.password, 12);

    if (!payload.avatar) {
      payload.avatar = 'https://example.com/default-avatar.png';
    }

    const reg = await this.adminsRepository.save(payload);

    return this._success('Register Berhasil', reg);
  }

  private generateJWT(
    payload: jwtPayload,
    expiresIn: string | number,
    secret_key: string,
  ) {
    return this.jwtService.sign(payload, {
      secret: secret_key,
      expiresIn: expiresIn,
    });
  }

  async login(payload: LoginDto): Promise<ResponseSuccess> {
    const checkGuruExists = await this.adminsRepository.findOne({
      where: {
        username: payload.username,
        role: payload.role,
      },
      select: {
        id: true,
        nama: true,
        email: true,
        username: true,
        password: true,
        role: true,
        refresh_token: true,
      },
    });

    if (!checkGuruExists) {
      throw new HttpException(
        'User tidak ditemukan',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const checkPassword = await compare(
      payload.password,
      checkGuruExists.password,
    );

    if (checkPassword) {
      const jwtPayload: jwtPayload = {
        id: checkGuruExists.id,
        nama: checkGuruExists.nama,
        email: checkGuruExists.email,
      };

      const access_token = await this.generateJWT(
        jwtPayload,
        '1d',
        jwt_config.access_token_secret,
      );
      const refresh_token = await this.generateJWT(
        jwtPayload,
        '7d',
        jwt_config.refresh_token_secret,
      );
      await this.adminsRepository.save({
        refresh_token: refresh_token,
        id: checkGuruExists.id,
      });
      return this._success('Login Success', {
        ...checkGuruExists,
        access_token: access_token,
        refresh_token: refresh_token,
      });
    } else {
      throw new HttpException(
        'username dan password tidak sama',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async Profile(id: number): Promise<ResponseSuccess> {
    const guru = await this.adminsRepository.findOne({
      where: {
        id: id,
      },
    });

    return this._success('OK', guru);
  }

  async RefreshToken(id: number, token: string): Promise<ResponseSuccess> {
    const checkGuruExists = await this.adminsRepository.findOne({
      where: {
        id: id,
        refresh_token: token,
      },
      select: {
        id: true,
        email: true,
        password: true,
        refresh_token: true,
      },
    });

    console.log('guru', checkGuruExists);
    if (checkGuruExists === null) {
      throw new UnauthorizedException();
    }

    const jwtPayload: jwtPayload = {
      id: checkGuruExists.id,
      email: checkGuruExists.email,
    };

    const access_token = await this.generateJWT(
      jwtPayload,
      '10d',
      jwt_config.access_token_secret,
    );

    const refresh_token = await this.generateJWT(
      jwtPayload,
      '1d',
      jwt_config.refresh_token_secret,
    );

    await this.adminsRepository.save({
      refresh_token: refresh_token,
      id: checkGuruExists.id,
    });

    return this._success('Success', {
      ...checkGuruExists,
      access_token: access_token,
      refresh_token: refresh_token,
    });
  }

  async forgotPassword(email: string): Promise<ResponseSuccess> {
    const user = await this.adminsRepository.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new HttpException(
        'Email tidak ditemukan',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const token = randomBytes(32).toString('hex');
    const link = `http://localhost:4000/auth/reset-password/${user.id}/${token}`;
    await this.mailService.sendForgotPassword({
      email: email,
      name: user.nama,
      link: link,
    });

    const payload = {
      user: {
        id: user.id,
      },
      token: token,
    };
    await this.resetPasswordRepository.save(payload);

    return this._success('Silahkan Cek Email');
  }

  async resetPassword(
    admins_id: number,
    token: string,
    payload: ResetPasswordDto,
  ): Promise<ResponseSuccess> {
    const userToken = await this.resetPasswordRepository.findOne({
      where: {
        token: token,
        admins: {
          id: admins_id,
        },
      },
    });

    if (!userToken) {
      throw new HttpException(
        'Token tidak valid',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    payload.new_password = await hash(payload.new_password, 12);
    await this.adminsRepository.save({
      password: payload.new_password,
      id: admins_id,
    });
    await this.resetPasswordRepository.delete({
      admins: {
        id: admins_id,
      },
    });

    return this._success('Reset Passwod Berhasil, Silahkan login ulang');
  }
}
