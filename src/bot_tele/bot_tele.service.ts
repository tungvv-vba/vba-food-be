// src/bot_tele/bot_tele.service.ts
import { Injectable, Logger } from "@nestjs/common";
import * as TelegramBot from "node-telegram-bot-api";
import OpenAI from "openai";

@Injectable()
export class BotTeleService {
  private bot: TelegramBot;
  private openai: OpenAI;
  private readonly logger = new Logger(BotTeleService.name);

  constructor() {
    this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    this.bot.on("message", async (msg) => {
      console.log(msg);
      const chatId = msg.chat.id;
      const text = msg.text;

      if (text) {
        try {
          const botResponse = await this.getResponse(text);
          const badWords = ["ngu", "óc", "chó", "đm", "địt", "cặc", "lồn", "đéo"];
          const hiwords = ["hi", "hello", "chào", "xin chào", "helo", "2"];

          if (badWords?.some((word) => text.includes(word))) {
            await this.bot.sendAnimation(
              chatId,
              "CAACAgUAAxkBAAICBGaxmTM5pVq3ZtDKKrguateqJH3kAAIMAAPsOSEfPu0HqTWDQHc1BA",
            );
          } else if (hiwords?.some((word) => text.includes(word))) {
            await this.bot.sendAnimation(
              chatId,
              "CgACAgQAAxkBAAICVGaxopYAAQdIho009KJC5JVAQhKZTgAC8AIAArZOHVMprmnOBgTJxTUE",
            );
          } else {
            await this.sendMessage(chatId, botResponse);
          }
        } catch (error) {
          this.logger.error("Error responding to message:", error);
        }
      }
    });
  }

  async getResponse(prompt: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 150,
      });

      return response.choices[0].message.content.trim();
    } catch (error) {
      if (error.response && error.response.status === 429) {
        this.logger.error("Rate limit exceeded. Please try again later.");
        return "Sorry, I am currently unavailable. Please try again later.";
      }
      throw error;
    }
  }

  async sendMessage(chatId: number, text: string) {
    try {
      await this.bot.sendMessage(chatId, text);
    } catch (error) {
      this.logger.error("Error sending message:", error);
    }
  }
}
