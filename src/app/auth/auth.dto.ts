import { PickType } from '@nestjs/mapped-types';
import {
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class ALlDto {
  @IsInt()
  id: number;

  @IsString()
  nama: string;

  @IsOptional()
  @IsString()
  avatar: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  username: string;

  @IsString()
  refresh_token: string;

  @IsOptional()
  @IsString()
  role: string;
}

export class RegisterDto extends PickType(ALlDto, [
  'email',
  'nama',
  'password',
  'username',
  'role',
]) {}

export class LoginDto extends PickType(ALlDto, [
  'username',
  'password',
  'role',
]) {}

export class ResetPasswordDto {
  @IsString()
  @MinLength(8)
  new_password: string;
}
