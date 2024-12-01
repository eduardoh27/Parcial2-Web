import { IsNotEmpty, IsString, Length, IsInt, Min } from 'class-validator';

export class ClaseDto {
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsString()
  @Length(10, 10)
  @IsNotEmpty()
  readonly codigo: string;

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  readonly creditos: number;
}
