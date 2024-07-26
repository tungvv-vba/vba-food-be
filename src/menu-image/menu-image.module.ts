import { Module } from '@nestjs/common';
import { MenuImageService } from './menu-image.service';
import { MenuImageController } from './menu-image.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuImageEntity } from './entities/menu-image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MenuImageEntity])],
  providers: [MenuImageService],
  controllers: [MenuImageController]
})
export class MenuImageModule {}
