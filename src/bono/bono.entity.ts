import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { ClaseEntity } from '../clase/clase.entity';

@Entity()
export class BonoEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    monto: number;  

    @Column()
    calificacion: number; 
    
    @Column()
    palabraClave: string;  

    @ManyToOne(() => UsuarioEntity, usuario => usuario.bonos)
    usuario: UsuarioEntity;  

    @ManyToOne(() => ClaseEntity, clase => clase.bonos)
    clase: ClaseEntity;
}
