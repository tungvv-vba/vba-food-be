import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";
import * as TelegramBot from "node-telegram-bot-api";
import OpenAI from "openai";
import { MenuImageService } from "src/menu-image/menu-image.service";
import { NotifyService } from "src/notify/notify.service";

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
  private teleAdminId: string;

  constructor(
    private readonly menuImageService: MenuImageService,
    private readonly configService: ConfigService,
    private notifyService: NotifyService,
  ) {
    this.teleAdminId = configService.getOrThrow("TELEGRAM_ADMIN_ID");
    this.bot = new TelegramBot(configService.get("TELEGRAM_BOT_TOKEN"), { polling: true });

    // this.bot.on("message", (msg) => this.handleMessage(msg));
    // this.openai = new OpenAI({
    //   apiKey: process.env.OPENAI_API_KEY,
    // });
    // // Authenticate Google API
    // const auth = new google.auth.GoogleAuth({
    //   keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    //   scopes: [
    //     "https://www.googleapis.com/auth/drive",
    //     "https://www.googleapis.com/auth/documents",
    //   ],
    // });
    // this.docs = google.docs({ version: "v1", auth });
  }

  async handleMessage(msg: TelegramBot.Message) {
    console.log(msg);

    const {
      text,
      photo,
      chat: { id: chatId },
    } = msg;

    if (text === "/notify" || text === "/notify@VBA_FOOD_BOT") {
      await this.notifyService.notifyNewFood();
    }

    if (text == "/weather" || text == "/weather@VBA_FOOD_BOT") {
      const city = "Hanoi";
      const apiKey = this.configService.get("WEATHERSTACK_API_KEY");
      const weatherUrl = `http://api.weatherstack.com/current?access_key=${apiKey}&query=${city}`;
      const { data } = await axios.get(weatherUrl);
      if (data.error) {
        await this.bot.sendMessage(
          chatId,
          `Không thể lấy thông tin thời tiết cho ${city}. Vui lòng thử lại.`,
        );
      } else {
        const weatherDescription = weatherVN[data.current.weather_descriptions[0]];
        const { temperature } = data.current;
        const { name: cityName, country, localtime } = data.location;
        const weatherMessage = `Thời tiết tại ${cityName}, ${country}:\nNhiệt độ: ${temperature}°C\nMô tả: ${weatherDescription} \nThời gian : ${localtime}`;
        await this.bot.sendMessage(chatId, weatherMessage);
      }
    }

    try {
      const fileId = photo[photo.length - 1].file_id;
      const filePath = await this.bot.getFile(fileId).then((file) => file.file_path);

      const fileUrl = `https://api.telegram.org/file/bot${this.configService.get("TELEGRAM_BOT_TOKEN")}/${filePath}`;
      const response = await axios.get(fileUrl, { responseType: "arraybuffer" });
      const buffer = Buffer.from(response.data, "binary");

      const file: Partial<Express.Multer.File> = {
        buffer,
        originalname: "vba-food.jpg",
        mimetype: "image/jpg",
      };

      await this.menuImageService.create([file]);

      this.sendMessage(msg.chat.id, "Upload ảnh thành công!");
    } catch (error) {
      this.sendMessage(msg.chat.id, "Upload ảnh thất bại!");
    }
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
            text: `User: ${msg.from?.first_name || "Unknown"}\nMessage: ${msg.text}\nTime: ${new Date().toLocaleString()}\n\n `,
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
