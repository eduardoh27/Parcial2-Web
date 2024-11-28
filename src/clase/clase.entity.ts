import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { BonoEntity } from '../bono/bono.entity';

@Entity()
export class ClaseEntity {
    @PrimaryGeneratedColumn()
    id: number; 

    @Column()
    nombre: string; 

    @Column({ unique: true })
    codigo: string;  

    @Column()
    creditos: number;  

    @ManyToOne(() => UsuarioEntity, usuario => usuario.clases)
    usuario: UsuarioEntity;  

    @OneToMany(() => BonoEntity, bono => bono.clase)
    bonos: BonoEntity[];  
}
