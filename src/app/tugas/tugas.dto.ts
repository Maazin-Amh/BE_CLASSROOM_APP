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

export class TugasDto {
  @IsInt()
  id?: number;

  @IsNotEmpty()
  @IsString()
  judul: string;

  @IsString()
  @IsOptional()
  files?: string;

  @IsNotEmpty()
  @IsString()
  subject: string;

  @IsObject()
  @IsOptional()
  created_by: { id: number };

  @IsObject()
  @IsOptional()
  updated_by: { id: number };

  @IsObject()
  @IsOptional()
  class_by: { id: number };

  @IsObject()
  @IsOptional()
  submited_by: { id: number };
}

export class CreateTugasDto extends PickType(TugasDto, [
  'judul',
  'subject',
  'files',
  'created_by',
  'class_by',
]) {}

export class UpdateTugasDto extends PickType(TugasDto, [
  'judul',
  'subject',
  'files',
  'updated_by',
]) {}

export class findAllTugas extends PageRequestDto {
  @IsString()
  @IsOptional()
  judul: string;

  @IsString()
  @IsOptional()
  subject: string;
}
