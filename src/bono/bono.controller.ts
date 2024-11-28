import { Controller, Get, Post, Param, Body, Delete, HttpCode } from '@nestjs/common';
import { BonoService } from './bono.service';
import { BonoEntity } from './bono.entity';
import { BonoDto } from './bono.dto';
import { BusinessLogicException } from '../shared/errors/business-errors';
import { UsuarioEntity } from 'src/usuario/usuario.entity';

@Controller('bonos')
export class BonoController {
    constructor(private readonly bonoService: BonoService) {}

    @Post()
    async crearBono(@Body() bonoDto: BonoDto): Promise<BonoEntity> {
        try {
            const bono = new BonoEntity();
            bono.monto = bonoDto.monto;
            bono.calificacion = bonoDto.calificacion;
            bono.palabraClave = bonoDto.palabraClave;
            bono.usuario = { id: bonoDto.usuarioId } as UsuarioEntity; 

            return await this.bonoService.crearBono(bono);
        } catch (error) {
            throw new BusinessLogicException(error.message, error.type);
        }
    }

    @Get('codigo/:cod')
    async findBonoByCodigo(@Param('cod') cod: string): Promise<BonoEntity[]> {
        try {
            return await this.bonoService.findBonoByCodigo(cod);
        } catch (error) {
            throw new BusinessLogicException(error.message, error.type);
        }
    }

    @Get('usuario/:userID')
    async findAllBonosByUsuario(@Param('userID') userID: number): Promise<BonoEntity[]> {
        try {
            return await this.bonoService.findAllBonosByUsuario(userID);
        } catch (error) {
            throw new BusinessLogicException(error.message, error.type);
        }
    }

    @Delete(':id')
    @HttpCode(204)
    async deleteBono(@Param('id') id: number): Promise<void> {
        try {
            await this.bonoService.deleteBono(id);
        } catch (error) {
            throw new BusinessLogicException(error.message, error.type);
        }
    }
}
