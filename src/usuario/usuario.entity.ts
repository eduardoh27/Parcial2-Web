import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { ClaseEntity } from '../clase/clase.entity';
import { BonoEntity } from '../bono/bono.entity';

@Entity()
export class UsuarioEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    cedula: number;

    @Column()
    nombre: string;

    @Column()
    grupo: string;

    @Column()
    numero: number;

    @Column()
    rol: string;

    @ManyToOne(() => UsuarioEntity, usuario => usuario.id, { nullable: true })
    jefe: UsuarioEntity;

    @OneToMany(() => ClaseEntity, clase => clase.usuario)
    clases: ClaseEntity[];

    @OneToMany(() => BonoEntity, bono => bono.usuario)
    bonos: BonoEntity[];
}
