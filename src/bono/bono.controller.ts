import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { BonoDto } from './bono.dto';
import { BonoEntity } from './bono.entity';
import { BonoService } from './bono.service';

@Controller('bonos')
@UseInterceptors(BusinessErrorsInterceptor)
export class BonoController {
  constructor(private readonly bonoService: BonoService) {}

  @Post()
  async crearBono(@Body() bonoDto: BonoDto) {
    const bono: BonoEntity = plainToInstance(BonoEntity, bonoDto);
    return await this.bonoService.crearBono(bono);
  }

  @Get('clase/:cod')
  async findBonoByCodigo(@Param('cod') cod: string) {
    return await this.bonoService.findBonoByCodigo(cod);
  }

  @Get('usuario/:usuarioId')
  async findAllBonosByUsuario(@Param('usuarioId') usuarioId: string) {
    return await this.bonoService.findAllBonosByUsuario(usuarioId);
  }

  @Delete(':bonoId')
  @HttpCode(204)
  async deleteBono(@Param('bonoId') bonoId: string) {
    return await this.bonoService.deleteBono(bonoId);
  }
  
}