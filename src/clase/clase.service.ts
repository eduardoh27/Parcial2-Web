import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClaseEntity } from './clase.entity';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';

@Injectable()
export class ClaseService {
    constructor(
        @InjectRepository(ClaseEntity)
        private readonly claseRepository: Repository<ClaseEntity>
    ) {}

    async findAll(): Promise<ClaseEntity[]> {
        return this.claseRepository.find({ relations: ['usuario', 'bonos'] });
      }

    async crearClase(clase: ClaseEntity): Promise<ClaseEntity> {
        if (clase.codigo.length !== 10) {
            throw new BusinessLogicException('El código de la clase debe tener exactamente 10 caracteres.', BusinessError.BAD_REQUEST);
        }

        return await this.claseRepository.save(clase);
    }

    async findClaseById(id: string): Promise<ClaseEntity> {
        const clase = await this.claseRepository.findOne({ where: { id } });
        if (!clase) {
            throw new BusinessLogicException('Clase no encontrada', BusinessError.NOT_FOUND);
        }
        return clase;
    }
}
