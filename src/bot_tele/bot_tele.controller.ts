// src/bot_tele/bot_tele.controller.ts
import { Controller, Post, Body } from "@nestjs/common";
import { BotTeleService } from "./bot_tele.service";

@Controller("telegram")
export class BotTeleController {
  constructor(private readonly botTeleService: BotTeleService) {}

  @Post("webhook")
  async handleMessage(@Body() body: any) {
    const message = body.message;
    if (!message || !message.text) {
      return;
    }

    const chatId = message.chat.id;
    const text = message.text;

    try {
      const botResponse = await this.botTeleService.getResponse(text);
      await this.botTeleService.sendMessage(chatId, botResponse);
    } catch (error) {
      console.error("Error responding to message:", error);
    }
  }
}
