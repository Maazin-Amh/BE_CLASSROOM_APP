import { PickType } from '@nestjs/mapped-types';
import { ALlDto } from '../auth/auth.dto';

export class UpdateProfileDto extends PickType(ALlDto, [
  'avatar',
  'nama',
  'id',
]) {}
