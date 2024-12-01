import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { UsuarioDto } from './usuario.dto';
import { UsuarioEntity } from './usuario.entity';
import { UsuarioService } from './usuario.service';

@Controller('usuarios')
@UseInterceptors(BusinessErrorsInterceptor)
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  async crearUsuario(@Body() usuarioDto: UsuarioDto) {
    const usuario: UsuarioEntity = plainToInstance(UsuarioEntity, usuarioDto);
    return await this.usuarioService.crearUsuario(usuario);
  }

  @Get(':usuarioId')
  async findUsuarioById(@Param('usuarioId') usuarioId: string) {
    return await this.usuarioService.findUsuarioById(usuarioId);
  }

  @Delete(':usuarioId')
  @HttpCode(204)
  async deleteUsuario(@Param('usuarioId') usuarioId: string) {
      return await this.usuarioService.eliminarUsuario(usuarioId);
  }
}