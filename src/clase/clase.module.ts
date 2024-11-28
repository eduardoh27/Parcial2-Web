import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClaseEntity } from './clase.entity';
import { ClaseService } from './clase.service';

@Module({
  providers: [ClaseService],
  imports: [TypeOrmModule.forFeature([ClaseEntity])]
})
export class ClaseModule {}
