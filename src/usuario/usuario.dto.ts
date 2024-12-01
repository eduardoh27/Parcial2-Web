import { IsNotEmpty, IsString, IsInt, IsIn } from 'class-validator';

export class UsuarioDto {
  @IsInt()
  @IsNotEmpty()
  readonly cedula: number;

  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsString()
  @IsNotEmpty()
  readonly grupo: string;

  @IsInt()
  @IsNotEmpty()
  readonly numero: number;

  @IsIn(['Profesor', 'Decana'])
  @IsNotEmpty()
  readonly rol: string;

  @IsString()
  readonly jefeId: string;
}
