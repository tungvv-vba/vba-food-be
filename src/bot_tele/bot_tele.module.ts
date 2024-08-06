import { Module } from "@nestjs/common";
import { BotTeleController } from "./bot_tele.controller";
import { BotTeleService } from "./bot_tele.service";

@Module({
  controllers: [BotTeleController],
  providers: [BotTeleService],
  exports: [BotTeleService],
})
export class BotTeleModule {}
