import { forwardRef, Module } from "@nestjs/common";
import { NotifyController } from "./notify.controller";
import { NotifyService } from "./notify.service";
import { MenuImageModule } from "src/menu-image/menu-image.module";

@Module({
  imports: [forwardRef(() => MenuImageModule)],
  controllers: [NotifyController],
  providers: [NotifyService],
  exports: [NotifyService],
})
export class NotifyModule {}
