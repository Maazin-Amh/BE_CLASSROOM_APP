// create-class.dto.ts
import { OmitType, PickType } from '@nestjs/mapped-types';
import {
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { PageRequestDto } from 'src/utils/dto/page.dto';

export class ClassDto {
  @IsInt()
  id?: number;

  @IsNotEmpty()
  @IsString()
  nama_kelas: string;

  @IsNotEmpty()
  @IsString()
  subject: string;

  @IsString()
  code?: string;

  @IsObject()
  @IsOptional()
  created_by: { id: number };

  @IsObject()
  @IsOptional()
  updated_by: { id: number };

  @IsObject()
  @IsOptional()
  join_by: { id: number };
}

export class CreateclassDto extends OmitType(ClassDto, [
  'updated_by',
  'join_by',
  'id',
  'code',
]) {}

export class UpdateClassDto extends OmitType(ClassDto, [
  'id',
  'created_by',
  'code',
  'join_by',
]) {}

export class JoinclassDto extends PickType(ClassDto, ['code', 'join_by']) {}

export class JoinClassDto {
  @IsNotEmpty()
  @IsString()
  readonly classCode: string;
}

export class findAllkelasDto extends PageRequestDto {
  @IsString()
  @IsOptional()
  nama_kelas: string;

  @IsString()
  @IsOptional()
  code: string;

  @IsString()
  @IsOptional()
  keyword: string;
}
