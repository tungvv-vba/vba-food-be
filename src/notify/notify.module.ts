import { forwardRef, Module } from "@nestjs/common";
import { NotifyController } from "./notify.controller";
import { NotifyService } from "./notify.service";
import { MenuImageModule } from "src/menu-image/menu-image.module";
import { OrderModule } from "src/order/order.module";

@Module({
  imports: [forwardRef(() => MenuImageModule), forwardRef(() => OrderModule)],
  controllers: [NotifyController],
  providers: [NotifyService],
  exports: [NotifyService],
})
export class NotifyModule {}
