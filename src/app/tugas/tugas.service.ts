import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import BaseResponse from 'src/utils/response/base.response';
import { Tugas } from './tugas.entity';
import { ResponsePagination, ResponseSuccess } from 'src/interface';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateTugasDto, UpdateTugasDto, findAllTugas } from './tugas.dto';
import { Class } from '../class/class.entity';

@Injectable()
export class TugasService extends BaseResponse {
  constructor(
    @InjectRepository(Tugas)
    private tugasRepository: Repository<Tugas>,
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
    @Inject(REQUEST) private req: any,
  ) {
    super();
  }

  async createTugas(
    payload: CreateTugasDto,
    classId: number,
  ): Promise<ResponseSuccess> {
    try {
      const associatedClass = await this.classRepository.findOne({
        where: { id: classId },
      });

      if (!associatedClass) {
        throw new HttpException('Class not found', HttpStatus.NOT_FOUND);
      }

      const newTugas = await this.tugasRepository.create({
        ...payload,
        class_by: associatedClass,
      });

      const createdTugas = await this.tugasRepository.save(newTugas);

      return this._success('Tugas created successfully', createdTugas);
    } catch (error) {
      throw new HttpException(
        `Hanya Role Guru Yang bisa create tugas`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async getDetail(id: number): Promise<ResponseSuccess> {
    const check = await this.tugasRepository.findOne({
      where: {
        id: id,
      },
      relations: ['created_by', 'updated_by', 'submites'],
    });

    if (check === null) {
      throw new NotFoundException(`Tugas dengan id ${id} tidak di temukan`);
    }

    return {
      status: 'ok',
      message: 'berhasil',
      data: check,
    };
  }

  async getAllTugas(query: findAllTugas): Promise<ResponsePagination> {
    const { page, pageSize, limit, judul } = query;

    const filterQuery: any = {};
    if (judul) {
      filterQuery.judul = Like(`%${judul}%`);
    }

    const total = await this.tugasRepository.count({
      where: filterQuery,
    });

    const result = await this.tugasRepository.find({
      where: filterQuery,
      relations: ['created_by', 'updated_by', 'class_by', 'submites'],
      select: {
        id: true,
        judul: true,
        subject: true,
        files: true,
        created_by: {
          id: true,
          nama: true,
        },
        updated_by: {
          id: true,
          nama: true,
        },
        class_by: {
          id: true,
          nama_kelas: true,
        },
        submites: {
          id: true,
          files: true,
        },
      },
      skip: limit,
      take: pageSize,
    });

    return this._pagination('oke', result, total, page, pageSize);
  }

  async update(id: number, payload: UpdateTugasDto): Promise<ResponseSuccess> {
    const kat = await this.tugasRepository.findOne({
      where: {
        id: id,
      },
    });

    if (kat === null) {
      throw new NotFoundException(`Tugas dengan id ${id} tidak di temukan`);
    }

    try {
      await this.tugasRepository.save({ ...payload, id: id });
      return this._success('OK', this.req.user.user_id);
    } catch {
      throw new HttpException('Ada Kesalahan', HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  async delete(id: number): Promise<ResponseSuccess> {
    const delet = await this.tugasRepository.findOne({
      where: {
        id: id,
      },
    });

    if (delet === null) {
      throw new NotFoundException(`Tugas dengan id ${id} tidak di temukan`);
    }
    const hapus = await this.tugasRepository.delete(id);
    return {
      status: 'ok',
      message: 'Berhasil Menghapus Tugas',
      data: hapus,
    };
  }
}
