/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { BonoEntity } from './bono.entity';
import { BonoService } from './bono.service';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { ClaseEntity } from '../clase/clase.entity';
import { faker } from '@faker-js/faker';
import { BusinessLogicException } from '../shared/errors/business-errors';

describe('BonoService', () => {
  let service: BonoService;
  let bonoRepository: Repository<BonoEntity>;
  let usuarioRepository: Repository<UsuarioEntity>;
  let claseRepository: Repository<ClaseEntity>;
  let usuario: UsuarioEntity;
  let clase: ClaseEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [BonoService],
    }).compile();

    service = module.get<BonoService>(BonoService);
    bonoRepository = module.get<Repository<BonoEntity>>(getRepositoryToken(BonoEntity));
    usuarioRepository = module.get<Repository<UsuarioEntity>>(getRepositoryToken(UsuarioEntity));
    claseRepository = module.get<Repository<ClaseEntity>>(getRepositoryToken(ClaseEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await bonoRepository.clear();
    await usuarioRepository.clear();
    await claseRepository.clear();

    usuario = await usuarioRepository.save({
      cedula: faker.number.int({ min: 100000, max: 999999 }),
      nombre: faker.person.firstName(),
      grupo: 'TICSW',
      numero: faker.number.int({ min: 10000000, max: 99999999 }),
      rol: 'Profesor',
      jefeId: faker.string.uuid(),
    });

    clase = await claseRepository.save({
      nombre: faker.lorem.word(),
      codigo: faker.string.alphanumeric(10),
      creditos: faker.number.int({ min: 1, max: 5 }),
      usuario: usuario,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('crearBono should create a new bono with valid data', async () => {
    const bono: BonoEntity = {
      id: '',
      monto: 1000,
      calificacion: 3.5,
      palabraClave: 'BONO_TEST',
      usuario: usuario,
      clase: clase,
    };

    const newBono = await service.crearBono(bono);
    expect(newBono).not.toBeNull();

    const storedBono = await bonoRepository.findOne({ where: { id: newBono.id } });
    expect(storedBono).not.toBeNull();
    expect(storedBono.monto).toEqual(newBono.monto);
  });

  it('crearBono should throw exception if monto is not positive', async () => {
    const bono: BonoEntity = {
      id: '',
      monto: -100,
      calificacion: 3.5,
      palabraClave: 'BONO_TEST',
      usuario: usuario,
      clase: clase,
    };

    await expect(() => service.crearBono(bono)).rejects.toHaveProperty('message', 'El monto del bono debe ser un valor positivo.');
  });

  it('findBonoByCodigo should return all bonos for a class', async () => {
    const bono: BonoEntity = await bonoRepository.save({
      monto: 1000,
      calificacion: 3.5,
      palabraClave: 'BONO_TEST',
      usuario: usuario,
      clase: clase,
    });

    const bonos = await service.findBonoByCodigo(clase.codigo);
    expect(bonos).not.toBeNull();
    expect(bonos.length).toBeGreaterThan(0);
    expect(bonos[0].id).toEqual(bono.id);
  });

  it('findBonoByCodigo should throw an exception for an invalid class code', async () => {
    await expect(() => service.findBonoByCodigo('INVALID_CODE')).rejects.toHaveProperty('message', 'Clase no encontrada con el código proporcionado.');
  });

  it('findAllBonosByUsuario should return all bonos for a user', async () => {
    const bono: BonoEntity = await bonoRepository.save({
      monto: 1000,
      calificacion: 3.5,
      palabraClave: 'BONO_TEST',
      usuario: usuario,
      clase: clase,
    });

    const bonos = await service.findAllBonosByUsuario(usuario.id);
    expect(bonos).not.toBeNull();
    expect(bonos.length).toBeGreaterThan(0);
    expect(bonos[0].id).toEqual(bono.id);
  });

  it('findAllBonosByUsuario should throw an exception for an invalid user ID', async () => {
    await expect(() => service.findAllBonosByUsuario('INVALID_USER')).rejects.toHaveProperty('message', 'Usuario no encontrado con el ID proporcionado.');
  });

  it('deleteBono should remove a bono', async () => {
    const bono: BonoEntity = await bonoRepository.save({
      monto: 1000,
      calificacion: 3.5,
      palabraClave: 'BONO_TEST',
      usuario: usuario,
      clase: clase,
    });

    await service.deleteBono(bono.id);
    const deletedBono = await bonoRepository.findOne({ where: { id: bono.id } });
    expect(deletedBono).toBeNull();
  });

  it('deleteBono should throw an exception if calificacion is greater than 4', async () => {
    const bono: BonoEntity = await bonoRepository.save({
      monto: 2000,
      calificacion: 4.5,
      palabraClave: 'BONO_TEST',
      usuario: usuario,
      clase: clase,
    });

    await expect(() => service.deleteBono(bono.id)).rejects.toHaveProperty('message', 'El bono no puede ser eliminado si su calificación es mayor a 4.');
  });
});
