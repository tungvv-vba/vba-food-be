import { BadRequestException, forwardRef, Inject, Injectable } from "@nestjs/common";
import axios from "axios";
import { MenuImageService } from "src/menu-image/menu-image.service";

@Injectable()
export class NotifyService {
  constructor(
    @Inject(forwardRef(() => MenuImageService)) private menuImageService: MenuImageService,
  ) {}

  private telegramBotUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
  private chatId = process.env.TELEGRAM_CHAT_ID;
  async sendNotificationToTelegram(message: string) {
    const payload = {
      chat_id: "-1002239636168", // this.chatId
      text: message,
    };

    try {
      await axios.post(this.telegramBotUrl, payload);
      return "Gửi thông báo thành công";
    } catch (error) {
      throw new BadRequestException("Lỗi khi gửi thông báo");
    }
  }

  async sendOfflineNotification() {
    const message = `Thông báo: hôm nay quán cơm nghỉ nhé mọi người ~~`;
    await this.sendNotificationToTelegram(message);
    const menuImages = await this.menuImageService.findAll();
    const menuImageIds = menuImages.map((menuImage) => menuImage.id);
    await this.menuImageService.delete(menuImageIds);
  }

  async sendPaymentReminder() {
    const message = `Anh em ơi, đừng quên\nNộp tiền cơm đúng hạn\nVí dù có khô cạn\nNhưng tình cảm còn đó\nNộp tiền cơm hôm nay\nĐể ngày mai no bụng💸\n\n0301000384746\nVietcombank\nVU VAN TUNG`;
    await this.sendNotificationToTelegram(message);
  }

  async notifyNewFood() {
    const message = `Đã có món mới hôm nay, vào đặt cơm bạn nhé! \n${process.env.FRONT_END_URL}`;
    await this.sendNotificationToTelegram(message);
  }
}
