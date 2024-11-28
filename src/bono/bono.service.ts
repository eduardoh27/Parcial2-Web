import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BonoEntity } from './bono.entity';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { ClaseEntity } from '../clase/clase.entity';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';

@Injectable()
export class BonoService {
    constructor(
        @InjectRepository(BonoEntity)
        private readonly bonoRepository: Repository<BonoEntity>,

        @InjectRepository(UsuarioEntity)
        private readonly usuarioRepository: Repository<UsuarioEntity>,

        @InjectRepository(ClaseEntity)
        private readonly claseRepository: Repository<ClaseEntity>
    ) {}

    async crearBono(bono: BonoEntity): Promise<BonoEntity> {
        if (!bono.monto || bono.monto <= 0) {
            throw new BusinessLogicException('El monto del bono debe ser un valor positivo.', BusinessError.BAD_REQUEST);
        }

        const usuario = await this.usuarioRepository.findOne({ where: { id: bono.usuario.id } });
        if (!usuario || usuario.rol !== 'Profesor') {
            throw new BusinessLogicException('El bono solo puede ser asignado a un usuario con rol de Profesor.', BusinessError.BAD_REQUEST);
        }

        return await this.bonoRepository.save(bono);
    }

    async findBonoByCodigo(cod: string): Promise<BonoEntity[]> {
        const clase = await this.claseRepository.findOne({ where: { codigo: cod }, relations: ['bonos'] });
        
        if (!clase) {
            throw new BusinessLogicException('Clase no encontrada con el código proporcionado.', BusinessError.NOT_FOUND);
        }
    
        return clase.bonos; 
    }

    async findAllBonosByUsuario(userID: number): Promise<BonoEntity[]> {
        const usuario = await this.usuarioRepository.findOne({ where: { id : userID }, relations: ['bonos'] });
        
        if (!usuario) {
            throw new BusinessLogicException('Usuario no encontrado con el ID proporcionado.', BusinessError.NOT_FOUND);
        }
    
        return usuario.bonos; 
    }

    async deleteBono(id: number): Promise<void> {
        const bono = await this.bonoRepository.findOne({ where: { id } });
        if (!bono) {
            throw new BusinessLogicException('Bono no encontrado.', BusinessError.NOT_FOUND);
        }

        if (bono.calificacion > 4) {
            throw new BusinessLogicException('El bono no puede ser eliminado si su calificación es mayor a 4.', BusinessError.PRECONDITION_FAILED);
        }

        await this.bonoRepository.remove(bono);
    }
}
