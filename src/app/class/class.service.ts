// class.service.ts
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Class } from './class.entity';
import { ResponsePagination, ResponseSuccess } from 'src/interface';
import { CreateclassDto, UpdateClassDto, findAllkelasDto } from './class.dto';
import BaseResponse from 'src/utils/response/base.response';
import { REQUEST } from '@nestjs/core';
import { Admins } from '../auth/auth.entity';

@Injectable()
export class ClassService extends BaseResponse {
  constructor(
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
    @Inject(REQUEST) private req: any,
    @InjectRepository(Admins)
    private readonly adminRepository: Repository<Admins>,
  ) {
    super();
  }

  async createClass(payload: CreateclassDto): Promise<ResponseSuccess> {
    try {
      const code = this.generateRandomCode();
      const newClass = await this.classRepository.save({
        ...payload,
        code,
      });

      return this._success('Class created successfully', newClass);
    } catch (error) {
      throw new HttpException(
        `Hanya Role Guru Yang bisa create Class`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async syncJoinbycode(code: string): Promise<ResponseSuccess> {
    console.log('Finding class with code:', code);

    // Find the class with the given code
    const foundClass = await this.classRepository.findOne({
      where: { code },
      relations: ['join_by'],
    });

    // If class not found, throw an error
    if (!foundClass) {
      console.error('Class not found with code:', code);
      throw new NotFoundException('Class not found');
    }
    console.log('Found class:', foundClass);

    try {
      console.log('Finding student with id:', this.req.user.id);

      // Find the student based on the username
      const student = await this.adminRepository.findOne({
        where: { id: this.req.user.id },
        relations: ['class'], // Ensure to load the classes relation
      });

      // If student not found, throw an error
      if (!student) {
        console.error('Student not found with username:', this.req.user.id);
        throw new NotFoundException('Student not found');
      }
      console.log('Found student:', student);

      // Check if the student is already joined to the class
      const isAlreadyJoined = foundClass.join_by.some(
        (joinedStudent) => joinedStudent.id === student.id,
      );
      if (isAlreadyJoined) {
        console.log('Student already joined the class');
        return this._success('oke', foundClass);
      }

      // Add the student to the class's join_by array
      foundClass.join_by.push(student);

      // Save the updated class
      await this.classRepository.save(foundClass);
      console.log('Student added to class successfully:', foundClass);

      return this._success('oke', foundClass);
    } catch (error) {
      console.error('Error during class join operation:', error);
      throw new HttpException('Ada Kesalahan', HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  async getDetail(id: number): Promise<ResponseSuccess> {
    const check = await this.classRepository.findOne({
      where: {
        id: id,
      },
      relations: ['created_by', 'updated_by', 'join_by', 'tugas_by'],
    });

    if (check === null) {
      throw new NotFoundException(`Kelas dengan id ${id} tidak di temukan`);
    }

    return {
      status: 'ok',
      message: 'berhasil',
      data: check,
    };
  }

  async update(id: number, payload: UpdateClassDto): Promise<ResponseSuccess> {
    const kat = await this.classRepository.findOne({
      where: {
        id: id,
      },
    });

    if (kat === null) {
      throw new NotFoundException(`class dengan id ${id} tidak di temukan`);
    }

    try {
      await this.classRepository.save({ ...payload, id: id });
      return this._success('OK', this.req.user.user_id);
    } catch {
      throw new HttpException('Ada Kesalahan', HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  async delete(id: number): Promise<ResponseSuccess> {
    const delet = await this.classRepository.findOne({
      where: {
        id: id,
      },
    });

    if (delet === null) {
      throw new NotFoundException(`Kelas dengan id ${id} tidak di temukan`);
    }
    const hapus = await this.classRepository.delete(id);
    return {
      status: 'ok',
      message: 'Berhasil Menghapus Kelas',
      data: hapus,
    };
  }

  async findAll(query: findAllkelasDto): Promise<ResponsePagination> {
    const { page, pageSize, limit, keyword } = query;

    const filterKeyword = [];

    if (keyword) {
      filterKeyword.push(
        {
          nama_kelas: Like(`%${keyword}%`),
        },
        {
          code: Like(`%${keyword}%`),
        },
      );
    }
    const total = await this.classRepository.count({
      where: filterKeyword,
    });
    const result = await this.classRepository.find({
      where: filterKeyword,
      relations: ['created_by', 'updated_by', 'join_by', 'tugas_by'],
      select: {
        id: true,
        nama_kelas: true,
        code: true,
        subject: true,
        created_by: {
          id: true,
          nama: true,
        },
        updated_by: {
          id: true,
          nama: true,
        },
        join_by: {
          id: true,
          username: true,
        },
        tugas_by: {
          id: true,
          judul: true,
        },
      },
      skip: limit,
      take: pageSize,
    });
    return this._pagination('OK', result, total, page, pageSize);
  }

  private generateRandomCode(): string {
    const min = 1000;
    const max = 9999;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNumber.toString(7).padStart(4, '0');
  }
}
