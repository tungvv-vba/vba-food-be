import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FileModule } from "src/file/file.module";
import { MenuImageEntity } from "./entities/menu-image.entity";
import { MenuImageController } from "./menu-image.controller";
import { MenuImageService } from "./menu-image.service";

@Module({
  imports: [TypeOrmModule.forFeature([MenuImageEntity]), FileModule],
  providers: [MenuImageService],
  controllers: [MenuImageController],
  exports: [MenuImageService],
})
export class MenuImageModule {}
