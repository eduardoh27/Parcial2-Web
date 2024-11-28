import { IsNotEmpty, IsPositive, IsString, IsOptional, IsNumber } from 'class-validator';

export class BonoDto {
    @IsPositive()
    monto: number;

    @IsOptional()
    @IsNumber()
    calificacion?: number;

    @IsString()
    @IsNotEmpty()
    palabraClave: string;

    @IsNumber()
    usuarioId: number; 
}
