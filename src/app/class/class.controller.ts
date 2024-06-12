// class.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClassService } from './class.service';
import { CreateclassDto, UpdateClassDto, findAllkelasDto } from './class.dto';
import { InjectCreatedBy } from 'src/utils/decorator/inject-created_by.decorator';
import { JwtGuard } from '../auth/auth.guard';
import { InjectUpdatedBy } from 'src/utils/decorator/inject-update_by.decorator';

@Controller('class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Post('create-class')
  @UseGuards(JwtGuard)
  async createClass(@InjectCreatedBy() payload: CreateclassDto) {
    return this.classService.createClass(payload);
  }

  // @Post('join')
  // async joinClassByCode(@Param('code') code: string) {
  //   return this.classService.joinByCode(code);
  // }

  @Get('list')
  async findAll(@Query() query: findAllkelasDto) {
    return this.classService.findAll(query);
  }

  @Put('update/:id')
  @UseGuards(JwtGuard)
  findOnepembelian(
    @Param('id') id: string,
    @InjectUpdatedBy() payload: UpdateClassDto,
  ) {
    return this.classService.update(Number(id), payload);
  }

  @Get('detail/:id')
  @UseGuards(JwtGuard)
  getDetail(@Param('id') id: string) {
    return this.classService.getDetail(Number(id));
  }

  @Post('join')
  @UseGuards(JwtGuard)
  async joinClass(@Body('code') code: string) {
    return this.classService.syncJoinbycode(code);
  }

  @Delete('delete/:id')
  deleteBook(@Param('id') id: string) {
    return this.classService.delete(+id);
  }
}
