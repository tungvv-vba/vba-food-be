import { Module } from "@nestjs/common";
import { MenuImageService } from "./menu-image.service";
import { MenuImageController } from "./menu-image.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MenuImageEntity } from "./entities/menu-image.entity";
import { NotifyModule } from "src/notify/notify.module";

@Module({
  imports: [TypeOrmModule.forFeature([MenuImageEntity]), NotifyModule],
  providers: [MenuImageService],
  controllers: [MenuImageController],
  exports: [MenuImageService],
})
export class MenuImageModule {}
