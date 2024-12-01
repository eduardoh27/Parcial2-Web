import { Body, Controller, Get, HttpCode, Param, Post, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ClaseDto } from './clase.dto';
import { ClaseEntity } from './clase.entity';
import { ClaseService } from './clase.service';

@Controller('clases')
@UseInterceptors(BusinessErrorsInterceptor)
export class ClaseController {
  constructor(private readonly claseService: ClaseService) {}

  @Get()
  async findAll() {
    return await this.claseService.findAll();
  }


  @Post()
  async crearClase(@Body() claseDto: ClaseDto) {
    const clase: ClaseEntity = plainToInstance(ClaseEntity, claseDto);
    return await this.claseService.crearClase(clase);
  }

  @Get(':claseId')
  async findClaseById(@Param('claseId') claseId: string) {
    return await this.claseService.findClaseById(claseId);
  }
}
