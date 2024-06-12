import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TugasService } from './tugas.service';
import { CreateTugasDto, UpdateTugasDto, findAllTugas } from './tugas.dto';
import { JwtGuard } from '../auth/auth.guard';
import { InjectCreatedBy } from 'src/utils/decorator/inject-created_by.decorator';
import { Pagination } from 'src/utils/decorator/pagination.decorator';
import { InjectUpdatedBy } from 'src/utils/decorator/inject-update_by.decorator';

@Controller('tugas')
export class TugasController {
  constructor(private readonly tugasService: TugasService) {}

  @Post(':id/create-tugas')
  @UseGuards(JwtGuard)
  async createClass(
    @InjectCreatedBy() payload: CreateTugasDto,
    @Param('id') id: string,
  ) {
    return this.tugasService.createTugas(payload, Number(id));
  }

  @Get('detail-tugas/:id')
  @UseGuards(JwtGuard)
  getDetail(@Param('id') id: string) {
    return this.tugasService.getDetail(Number(id));
  }

  @Get('list')
  async getAlltugas(@Pagination() query: findAllTugas) {
    return this.tugasService.getAllTugas(query);
  }

  @Put('update/:id')
  @UseGuards(JwtGuard)
  findOnepembelian(
    @Param('id') id: string,
    @InjectUpdatedBy() payload: UpdateTugasDto,
  ) {
    return this.tugasService.update(Number(id), payload);
  }

  @Delete('delete/:id')
  deleteBook(@Param('id') id: string) {
    return this.tugasService.delete(+id);
  }
}
