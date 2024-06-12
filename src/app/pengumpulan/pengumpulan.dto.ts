// submit-assignment.dto.ts

import { PickType } from '@nestjs/mapped-types';
import { IsInt, IsObject, IsOptional, IsString } from 'class-validator';
import { PageRequestDto } from 'src/utils/dto/page.dto';

export class PenugmpulanDto {
  @IsInt()
  id: number;

  @IsString()
  files: string;

  @IsObject()
  @IsOptional()
  tugas_by: { id: number };

  @IsObject()
  @IsOptional()
  created_by: { id: number };
}

export class SubmitDto extends PickType(PenugmpulanDto, [
  'files',
  'tugas_by',
  'created_by',
]) {}

export class findAllSubmit extends PageRequestDto {
  @IsString()
  @IsOptional()
  files: string;
}
