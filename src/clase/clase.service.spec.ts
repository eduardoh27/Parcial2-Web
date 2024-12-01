/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ClaseEntity } from './clase.entity';
import { ClaseService } from './clase.service';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { faker } from '@faker-js/faker';
import { BusinessLogicException } from '../shared/errors/business-errors';

describe('ClaseService', () => {
  let service: ClaseService;
  let claseRepository: Repository<ClaseEntity>;
  let usuarioRepository: Repository<UsuarioEntity>;
  let claseList: ClaseEntity[];
  let usuario: UsuarioEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ClaseService],
    }).compile();

    service = module.get<ClaseService>(ClaseService);
    claseRepository = module.get<Repository<ClaseEntity>>(getRepositoryToken(ClaseEntity));
    usuarioRepository = module.get<Repository<UsuarioEntity>>(getRepositoryToken(UsuarioEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await claseRepository.clear();
    await usuarioRepository.clear();

    usuario = await usuarioRepository.save({
      cedula: faker.number.int({ min: 100000, max: 999999 }),
      nombre: faker.person.firstName(),
      grupo: 'TICSW',
      numero: faker.number.int({ min: 10000000, max: 99999999 }),
      rol: 'Profesor',
      jefeId: faker.string.uuid(),
    });

    claseList = [];
    for (let i = 0; i < 5; i++) {
      const clase: ClaseEntity = await claseRepository.save({
        nombre: faker.lorem.word(),
        codigo: faker.string.alphanumeric(10),
        creditos: faker.number.int({ min: 1, max: 5 }),
        usuario: usuario,
      });
      claseList.push(clase);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('crearClase should create a new class with valid data', async () => {
    const clase: ClaseEntity = {
      id: '',
      nombre: faker.lorem.word(),
      codigo: faker.string.alphanumeric(10),
      creditos: faker.number.int({ min: 1, max: 5 }),
      bonos: [],
      usuario: usuario,
    };

    const newClase = await service.crearClase(clase);
    expect(newClase).not.toBeNull();

    const storedClase = await claseRepository.findOne({ where: { id: newClase.id } });
    expect(storedClase).not.toBeNull();
    expect(storedClase.codigo).toEqual(newClase.codigo);
  });

  it('crearClase should throw exception with invalid code length', async () => {
    const clase: ClaseEntity = {
      id: '',
      nombre: faker.lorem.word(),
      codigo: faker.string.alphanumeric(8), // Código inválido con longitud diferente a 10
      creditos: faker.number.int({ min: 1, max: 5 }),
      bonos: [],
      usuario: usuario,
    };

    await expect(() => service.crearClase(clase)).rejects.toHaveProperty('message', 'El código de la clase debe tener exactamente 10 caracteres.');
  });

  it('findClaseById should return a class by ID', async () => {
    const storedClase = claseList[0];
    const clase = await service.findClaseById(storedClase.id);
    expect(clase).not.toBeNull();
    expect(clase.nombre).toEqual(storedClase.nombre);
  });

  it('findClaseById should throw an exception for an invalid class', async () => {
    await expect(() => service.findClaseById('0')).rejects.toHaveProperty('message', 'Clase no encontrada');
  });
});
