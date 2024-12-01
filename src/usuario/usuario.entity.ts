import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { ClaseEntity } from '../clase/clase.entity';
import { BonoEntity } from '../bono/bono.entity';

@Entity()
export class UsuarioEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

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

    @Column({ nullable: true }) 
    jefeId: string;  

    @OneToMany(() => ClaseEntity, clase => clase.usuario)
    clases: ClaseEntity[];

    @OneToMany(() => BonoEntity, bono => bono.usuario)
    bonos: BonoEntity[];
}
