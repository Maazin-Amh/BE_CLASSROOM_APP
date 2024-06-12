import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BaseResponse from 'src/utils/response/base.response';
import { Admins } from '../auth/auth.entity';
import { ResponseSuccess } from 'src/interface/response.interface';
import { Repository } from 'typeorm';
import { UpdateProfileDto } from './profile.dto';

@Injectable()
export class ProfileService extends BaseResponse {
  constructor(
    @InjectRepository(Admins)
    private readonly profileRepository: Repository<Admins>,
  ) {
    super();
  }

  async updateProfile(
    id: number,
    payload: UpdateProfileDto,
  ): Promise<ResponseSuccess> {
    const update = await this.profileRepository.save({
      nama: payload.nama,
      avatar: payload.avatar,
      id: id,
    });

    return this._success('Update Success', update);
  }
}
