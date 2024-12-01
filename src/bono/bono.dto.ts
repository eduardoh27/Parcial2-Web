import { IsNotEmpty, IsString, IsInt, IsPositive, IsNumber, Min } from 'class-validator';

export class BonoDto {

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  readonly monto: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  readonly calificacion: number;

  @IsString()
  @IsNotEmpty()
  readonly palabraClave: string;
}
