import {
  Controller,
  Delete,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

import { ResponseSuccess } from '../../interface/response.interface';
import BaseResponse from '../../utils/response/base.response';
import { UploadValidationService } from './upload-validation.service';
import { UploadValidationArrayService } from './upload-validation-array.service';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

@Controller('upload')
export class UploadController extends BaseResponse {
  constructor() {
    super();
  }

  private uploadToCloudinary(
    file: Express.Multer.File,
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'classroom',
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        },
      );

      Readable.from(file.buffer).pipe(uploadStream);
    });
  }

  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
      storage: memoryStorage(),
    }),
  )
  @Post('file')
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseSuccess> {
    try {
      if (!file) {
        throw new HttpException(
          'File tidak ditemukan',
          HttpStatus.BAD_REQUEST,
        );
      }

      const result = await this.uploadToCloudinary(file);

      return this._success('OK', {
        file_url: result.secure_url,
        file_name: result.public_id,
        file_size: file.size,
        file_type: file.mimetype,
      });
    } catch (err) {
      console.error('UPLOAD ERROR:', err);

      throw new HttpException(
        'Gagal upload file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseInterceptors(
    FilesInterceptor('files', 20, {
      fileFilter:
        UploadValidationArrayService.imageOrPdfFileFilter,
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
      storage: memoryStorage(),
    }),
  )
  @Post('files')
  async uploadFileMulti(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<ResponseSuccess> {
    try {
      if (!files || files.length === 0) {
        throw new HttpException(
          'File tidak ditemukan',
          HttpStatus.BAD_REQUEST,
        );
      }

      const file_response: Array<{
        file_url: string;
        file_name: string;
        file_size: number;
      }> = [];

      for (const file of files) {
        const result = await this.uploadToCloudinary(file);

        file_response.push({
          file_url: result.secure_url,
          file_name: result.public_id,
          file_size: file.size,
        });
      }

      return this._success('OK', {
        file: file_response,
      });
    } catch (err) {
      console.error('UPLOAD MULTI ERROR:', err);

      throw new HttpException(
        'Gagal upload file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('file/delete/:filename')
  async DeleteFile(
    @Param('filename') filename: string,
  ): Promise<ResponseSuccess> {
    try {
      await cloudinary.uploader.destroy(filename, {
        resource_type: 'image',
      });

      return this._success('Berhasil menghapus File');
    } catch (err) {
      console.error('DELETE ERROR:', err);

      throw new HttpException(
        'Gagal menghapus file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}