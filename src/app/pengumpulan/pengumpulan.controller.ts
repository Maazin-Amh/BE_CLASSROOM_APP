import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { PengumpulanService } from './pengumpulan.service';
import { JwtGuard } from '../auth/auth.guard';
import { InjectCreatedBy } from 'src/utils/decorator/inject-created_by.decorator';
import { SubmitDto, findAllSubmit } from './pengumpulan.dto';
import { Pagination } from 'src/utils/decorator/pagination.decorator';

@Controller('pengumpulan')
export class PengumpulanController {
  constructor(private readonly pengumpulanService: PengumpulanService) {}

  @Post(':id/submit')
  @UseGuards(JwtGuard)
  async createsubmit(
    @InjectCreatedBy() payload: SubmitDto,
    @Param('id') id: number,
  ) {
    return this.pengumpulanService.submitAssignment(payload, Number(id));
  }

  @Get('list')
  @UseGuards(JwtGuard)
  async getAlltugas(@Pagination() query: findAllSubmit) {
    return this.pengumpulanService.getAllSubmit(query);
  }
}
