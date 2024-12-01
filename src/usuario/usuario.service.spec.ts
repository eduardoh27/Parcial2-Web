/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { UsuarioEntity } from './usuario.entity';
import { UsuarioService } from './usuario.service';
import { BonoEntity } from '../bono/bono.entity';
import { faker } from '@faker-js/faker';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let usuarioRepository: Repository<UsuarioEntity>;
  let bonoRepository: Repository<BonoEntity>;
  let usuarioList: UsuarioEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [UsuarioService],
    }).compile();

    service = module.get<UsuarioService>(UsuarioService);
    usuarioRepository = module.get<Repository<UsuarioEntity>>(getRepositoryToken(UsuarioEntity));
    bonoRepository = module.get<Repository<BonoEntity>>(getRepositoryToken(BonoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await usuarioRepository.clear();
    usuarioList = [];
    for (let i = 0; i < 5; i++) {
      const usuario: UsuarioEntity = await usuarioRepository.save({
        cedula: faker.number.int({ min: 100000, max: 999999 }),
        nombre: faker.person.firstName(),
        grupo: 'TICSW',
        numero: faker.number.int({ min: 10000000, max: 99999999 }),
        rol: 'Profesor',
        jefeId: faker.string.uuid(),
      });
      usuarioList.push(usuario);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('crearUsuario should create a new user with valid data', async () => {
    const usuario: UsuarioEntity = {
      id: '',
      cedula: faker.number.int({ min: 100000, max: 999999 }),
      nombre: faker.person.firstName(),
      grupo: 'IMAGINE',
      numero: faker.number.int({ min: 10000000, max: 99999999 }),
      rol: 'Profesor',
      jefeId: faker.string.uuid(),
      clases: [],
      bonos: [],
    };

    const newUsuario = await service.crearUsuario(usuario);
    expect(newUsuario).not.toBeNull();

    const storedUsuario = await usuarioRepository.findOne({ where: { id: newUsuario.id } });
    expect(storedUsuario).not.toBeNull();
    expect(storedUsuario.nombre).toEqual(newUsuario.nombre);
  });

  it('crearUsuario should throw exception with invalid group for Profesor', async () => {
    const usuario: UsuarioEntity = {
      id: '',
      cedula: faker.number.int({ min: 100000, max: 999999 }),
      nombre: faker.person.firstName(),
      grupo: 'INVALID_GROUP',
      numero: faker.number.int({ min: 10000000, max: 99999999 }),
      rol: 'Profesor',
      jefeId: faker.string.uuid(),
      clases: [],
      bonos: [],
    };

    await expect(() => service.crearUsuario(usuario)).rejects.toHaveProperty('message', 'El grupo de investigación debe ser uno de los siguientes: TICSW, IMAGINE, COMIT.');
  });

  it('findUsuarioById should return a user by ID', async () => {
    const storedUsuario = usuarioList[0];
    const usuario = await service.findUsuarioById(storedUsuario.id);
    expect(usuario).not.toBeNull();
    expect(usuario.nombre).toEqual(storedUsuario.nombre);
  });

  it('findUsuarioById should throw an exception for an invalid user', async () => {
    await expect(() => service.findUsuarioById('0')).rejects.toHaveProperty('message', 'Usuario no encontrado');
  });

  it('eliminarUsuario should remove a user', async () => {
    const usuario = usuarioList[0];
    await service.eliminarUsuario(usuario.id);
    const deletedUsuario = await usuarioRepository.findOne({ where: { id: usuario.id } });
    expect(deletedUsuario).toBeNull();
  });

  it('eliminarUsuario should throw an exception for a user with role Decana', async () => {
    const usuario: UsuarioEntity = await usuarioRepository.save({
      cedula: faker.number.int({ min: 100000, max: 999999 }),
      nombre: faker.person.firstName(),
      grupo: 'COMIT',
      numero: faker.number.int({ min: 10000000, max: 99999999 }),
      rol: 'Decana',
      jefeId: faker.string.uuid(),
    });

    await expect(() => service.eliminarUsuario(usuario.id)).rejects.toHaveProperty('message', 'No se puede eliminar a un usuario con rol de Decana');
  });

  it('eliminarUsuario should throw an exception if user has associated bonuses', async () => {
    const usuario = usuarioList[0];
    await bonoRepository.save({
      monto: 1000,
      calificacion: 3.5,
      palabraClave: 'BONO_TEST',
      usuario: usuario,
      clase: null,
    });

    await expect(() => service.eliminarUsuario(usuario.id)).rejects.toHaveProperty('message', 'No se puede eliminar al usuario porque tiene un bono asociado');
  });
});
