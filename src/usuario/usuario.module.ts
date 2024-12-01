import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from './usuario.entity';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { BonoEntity } from '../bono/bono.entity';


@Module({
  imports: [TypeOrmModule.forFeature([UsuarioEntity, BonoEntity])],
  providers: [UsuarioService],
  controllers: [UsuarioController],
})
export class UsuarioModule {}