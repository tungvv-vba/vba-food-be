import { Module } from "@nestjs/common";
import { MenuImageService } from "./menu-image.service";
import { MenuImageController } from "./menu-image.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MenuImageEntity } from "./entities/menu-image.entity";
import { NotifyModule } from "src/notify/notify.module";
import { UploadFileModule } from "src/upload-file/upload-file.module";

@Module({
  imports: [TypeOrmModule.forFeature([MenuImageEntity]), NotifyModule, UploadFileModule],
  providers: [MenuImageService],
  controllers: [MenuImageController],
  exports: [MenuImageService],
})
export class MenuImageModule {}
