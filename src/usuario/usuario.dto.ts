import { IsNotEmpty, IsString, IsInt, Length } from 'class-validator';

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

  @IsString()
  @IsNotEmpty()
  @Length(6, 7) // Para roles como "Profesor" o "Decana"
  readonly rol: string;

  @IsString()
  readonly jefeId: string;
}
