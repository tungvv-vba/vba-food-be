// src/bot_tele/bot_tele.service.ts
import { Injectable, Logger } from "@nestjs/common";
import * as TelegramBot from "node-telegram-bot-api";
import OpenAI from "openai";

const telegramToken = "7442551136:AAEqsHsZHHywSb5VYc-F_GDfnR3HbDmTHnk";

@Injectable()
export class BotTeleService {
  private bot: TelegramBot;
  private openai: OpenAI;
  private readonly logger = new Logger(BotTeleService.name);

  constructor() {
    this.bot = new TelegramBot(telegramToken, { polling: true });
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
          await this.sendMessage(chatId, botResponse);
          const badWords = ["ngu", "óc", "chó", "đm", "địt", "cặc", "lồn", "đéo"];

          if (badWords.some((word) => text.includes(word))) {
            await this.bot.sendAnimation(
              chatId,
              "CAACAgUAAxkBAAICBGaxmTM5pVq3ZtDKKrguateqJH3kAAIMAAPsOSEfPu0HqTWDQHc1BA",
            );
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
