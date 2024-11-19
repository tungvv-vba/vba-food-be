import { Module } from "@nestjs/common";
import { MenuImageModule } from "src/menu-image/menu-image.module";
import { NotifyModule } from "src/notify/notify.module";
import { BotTeleController } from "./bot_tele.controller";
import { BotTeleService } from "./bot_tele.service";

@Module({
  imports: [MenuImageModule, NotifyModule],
  controllers: [BotTeleController],
  providers: [BotTeleService],
  exports: [BotTeleService],
})
export class BotTeleModule {}
