import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClaseEntity } from './clase.entity';
import { ClaseService } from './clase.service';
import { ClaseController } from './clase.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ClaseEntity])],
  providers: [ClaseService],
  controllers: [ClaseController],
})
export class ClaseModule {}