import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import BaseResponse from 'src/utils/response/base.response';
import { Tugas } from '../tugas/tugas.entity';
import { Like, Repository } from 'typeorm';
import { ResponsePagination, ResponseSuccess } from 'src/interface';
import { Pengumpulan } from './pengumpulan.entity';
import { SubmitDto, findAllSubmit } from './pengumpulan.dto';

@Injectable()
export class PengumpulanService extends BaseResponse {
  constructor(
    @InjectRepository(Tugas)
    private tugasRepository: Repository<Tugas>,
    @InjectRepository(Pengumpulan)
    private pengumpulanRepository: Repository<Pengumpulan>,
    @Inject(REQUEST) private req: any,
  ) {
    super();
  }

  async submitAssignment(
    payload: SubmitDto,
    tugasId: number,
  ): Promise<ResponseSuccess> {
    try {
      const tugas = await this.tugasRepository.findOne({
        where: { id: tugasId },
      });
      if (!tugas) {
        throw new HttpException('Tugas not found', HttpStatus.NOT_FOUND);
      }

      const newSubmission = await this.pengumpulanRepository.save({
        ...payload,
        tugas_by: tugas,
      });

      return this._success('Assignment submitted successfully', newSubmission);
    } catch (error) {
      console.error('Error:', error);
      throw new HttpException(
        'maaf ada yang salah',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllSubmit(query: findAllSubmit): Promise<ResponsePagination> {
    const { page, pageSize, limit, files } = query;

    const filterQuery: any = {};
    if (files) {
      filterQuery.files = Like(`%${files}%`);
    }

    const total = await this.pengumpulanRepository.count({
      where: filterQuery,
    });

    const result = await this.pengumpulanRepository.find({
      where: filterQuery,
      relations: ['created_by', 'tugas_by'],
      select: {
        id: true,
        files: true,
        created_by: {
          id: true,
          nama: true,
        },
        tugas_by: {
          id: true,
          judul: true,
        },
      },
      skip: limit,
      take: pageSize,
    });

    return this._pagination('oke', result, total, page, pageSize);
  }
}
