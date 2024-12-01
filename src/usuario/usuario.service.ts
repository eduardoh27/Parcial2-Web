import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuarioEntity } from './usuario.entity';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';
import { BonoEntity } from '../bono/bono.entity';

@Injectable()
export class UsuarioService {
    constructor(
        @InjectRepository(UsuarioEntity)
        private readonly usuarioRepository: Repository<UsuarioEntity>,
        
        @InjectRepository(BonoEntity)
        private readonly bonoRepository: Repository<BonoEntity>
    ) {}

      
  async findAll(): Promise<UsuarioEntity[]> {
    return this.usuarioRepository.find({ relations: ['clases', 'bonos'] });
  }


    async crearUsuario(usuario: UsuarioEntity): Promise<UsuarioEntity> {
        if (usuario.rol === 'Profesor' && !['TICSW', 'IMAGINE', 'COMIT'].includes(usuario.grupo)) {
            throw new BusinessLogicException('El grupo de investigación debe ser uno de los siguientes: TICSW, IMAGINE, COMIT.', BusinessError.BAD_REQUEST);
        }

        if (usuario.rol === 'Decana' && usuario.numero.toString().length !== 8) {
            throw new BusinessLogicException('El número de extensión de la Decana debe tener 8 dígitos.', BusinessError.BAD_REQUEST);
        }

        return await this.usuarioRepository.save(usuario);
    }

    async findUsuarioById(id: string): Promise<UsuarioEntity> {
        const usuario = await this.usuarioRepository.findOne({ where: { id } });
        if (!usuario) {
            throw new BusinessLogicException('Usuario no encontrado', BusinessError.NOT_FOUND);
        }
        return usuario;
    }

    async eliminarUsuario(id: string): Promise<void> {
        const usuario = await this.usuarioRepository.findOne({ where: { id } });
        if (!usuario) {
            throw new BusinessLogicException('Usuario no encontrado', BusinessError.NOT_FOUND);
        }

        if (usuario.rol === 'Decana') {
            throw new BusinessLogicException('No se puede eliminar a un usuario con rol de Decana', BusinessError.PRECONDITION_FAILED);
        }

        const bono = await this.bonoRepository.findOne({ where: { usuario: { id } } });
        if (bono) {
            throw new BusinessLogicException('No se puede eliminar al usuario porque tiene un bono asociado', BusinessError.PRECONDITION_FAILED);
        }

        await this.usuarioRepository.remove(usuario);
    }
}
