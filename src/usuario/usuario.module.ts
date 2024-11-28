import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioService } from './usuario.service';
import { UsuarioEntity } from './usuario.entity';
import { BonoEntity } from '../bono/bono.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioEntity, BonoEntity])],
  providers: [UsuarioService],
  exports: [UsuarioService],
})
export class UsuarioModule {}
