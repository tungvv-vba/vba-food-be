import { Injectable, Logger } from "@nestjs/common";
import * as TelegramBot from "node-telegram-bot-api";
import OpenAI from "openai";
import { google } from "googleapis";
import axios from "axios";

const weatherVN = {
  Sunny: "Nắng",
  Clear: "Trời quang đãng",
  "Partly cloudy": "Có mây rải rác",
  Cloudy: "Nhiều mây",
  Overcast: "U ám",
  Rain: "Mưa",
  "Light rain": "Mưa nhẹ",
  "Heavy rain": "Mưa to",
  Showers: "Mưa rào",
  Thunderstorm: "Dông bão",
  Snow: "Tuyết",
  "Light snow": "Tuyết nhẹ",
  "Heavy snow": "Tuyết dày",
  Sleet: "Mưa tuyết",
  Hail: "Mưa đá",
  Fog: "Sương mù",
  Mist: "Sương mù nhẹ",
  Haze: "Khói mù",
  Windy: "Có gió",
  Blustery: "Gió mạnh",
  Drizzle: "Mưa phùn",
  Ice: "Đóng băng",
  "Freezing rain": "Mưa đóng băng",
  Hot: "Nóng",
  Cold: "Lạnh",
  Humid: "Ẩm ướt",
  Dry: "Khô",
  Breezy: "Gió nhẹ",
  Dust: "Bụi",
  Sandstorm: "Bão cát",
};

@Injectable()
export class BotTeleService {
  private bot: TelegramBot;
  private openai: OpenAI;
  private readonly logger = new Logger(BotTeleService.name);
  private docs: any;

  constructor() {
    this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Authenticate Google API
    const auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      scopes: [
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/documents",
      ],
    });
    this.docs = google.docs({ version: "v1", auth });

    this.bot.on("message", async (msg) => {
      console.log(msg);
      const chatId = msg.chat.id;
      const text = msg.text;
      if (text) {
        try {
          const botResponse = await this.getResponse(text);
          console.log(botResponse);
          const badWords = ["ngu", "óc", "chó", "đm", "địt", "cặc", "lồn", "đéo"];
          const hiwords = ["hello", "chào", "xin chào", "helo"];
          const arrAnimationBad = [
            "CAACAgUAAxkBAAICBGaxmTM5pVq3ZtDKKrguateqJH3kAAIMAAPsOSEfPu0HqTWDQHc1BA",
            "CgACAgQAAxkBAAMdZrHtCr4c5wwQ2RIM04VEKjJFKowAAgwDAAKyQAxTZn3wIGfbZU01BA",
            "CgACAgQAAxkBAAMeZrHtO_up5ux4edTQ9yGgosLL3acAAggDAALVGw1TJYtdAbytVN01BA",
            "CAACAgUAAxkBAAMfZrHtTiYkU74f563poSyj6I4oDF0AAicEAAKp8JBVgB5-8nvYGdQ1BA",
          ];
          if (text == "/wheather" || text == "/wheather@VBA_FOOD_BOT") {
            const city = "Hanoi";
            const apiKey = process.env.WEATHERSTACK_API_KEY;
            const weatherUrl = `http://api.weatherstack.com/current?access_key=${apiKey}&query=${city}`;

            const weatherResponse = await axios.get(weatherUrl);
            const weatherData = weatherResponse.data;
            if (weatherData.error) {
              await this.bot.sendMessage(
                chatId,
                `Không thể lấy thông tin thời tiết cho ${city}. Vui lòng thử lại.`,
              );
            } else {
              const weatherDescription = weatherVN[weatherData.current.weather_descriptions[0]];
              const temperature = weatherData.current.temperature;
              const cityName = weatherData.location.name;
              const country = weatherData.location.country;
              const time = weatherData.location.localtime;

              const weatherMessage = `Thời tiết tại ${cityName}, ${country}:\nNhiệt độ: ${temperature}°C\nMô tả: ${weatherDescription} \nThời gian : ${time}`;

              await this.bot.sendMessage(chatId, weatherMessage);
            }
          } else if (badWords?.some((word) => text.includes(word))) {
            await this.bot.sendAnimation(
              chatId,
              arrAnimationBad[Math.floor(Math.random() * arrAnimationBad.length)],
            );
          } else if (hiwords?.some((word) => text.includes(word))) {
            await this.bot.sendAnimation(
              chatId,
              "CAACAgQAAxkBAAIDKGa5kDEvdPqM-bNYmokKFZrxmIekAAKlEgAC8j5oUK6XKhg4oPDANQQ",
            );
          } else {
            await this.sendMessage(chatId, botResponse);
          }
          await this.saveMessageToGoogleDocs(msg);
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

  async saveMessageToGoogleDocs(msg: TelegramBot.Message) {
    try {
      const documentId = "1eOtR1xl_o7FSb8XZFjgKOwzCZxjva6ZWeazcgjk-x14";

      const document = await this.docs.documents.get({ documentId });
      const content = document.data.body?.content || [];
      const newContent = [
        {
          insertText: {
            text: `User: ${msg.from?.first_name || "Unknown"}\nMessage: ${msg.text}\nid : ${msg.from?.id}\nTime: ${new Date().toLocaleString()}\n\n `,
            endOfSegmentLocation: {},
          },
        },
      ];

      await this.docs.documents.batchUpdate({
        documentId,
        requestBody: {
          requests: newContent,
        },
      });

      this.logger.log("Message saved to Google Docs.");
    } catch (error) {
      this.logger.error("Error saving message to Google Docs:", error);
    }
  }
}
