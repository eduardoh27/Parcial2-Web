import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from '../../usuario/usuario.entity';
import { ClaseEntity } from '../../clase/clase.entity';
import { BonoEntity } from '../../bono/bono.entity';

export const TypeOrmTestingConfig = () => [
 TypeOrmModule.forRoot({
   type: 'sqlite',
   database: ':memory:',
   dropSchema: true,
   entities: [UsuarioEntity, ClaseEntity, BonoEntity],
   synchronize: true,
   keepConnectionAlive: true
 }),
 TypeOrmModule.forFeature([UsuarioEntity, ClaseEntity, BonoEntity]),
];
