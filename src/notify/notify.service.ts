import { BadRequestException, forwardRef, Inject, Injectable } from "@nestjs/common";
import axios from "axios";
import { MenuImageService } from "src/menu-image/menu-image.service";
import { OrderService } from "src/order/order.service";

@Injectable()
export class NotifyService {
  constructor(
    @Inject(forwardRef(() => MenuImageService)) private menuImageService: MenuImageService,
    @Inject(forwardRef(() => OrderService)) private orderService: OrderService,
  ) {}

  private telegramBotUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
  private chatId = process.env.TELEGRAM_CHAT_ID;
  async sendNotificationToTelegram(message: string) {
    const payload = {
      chat_id: "-1002239636168", // this.chatId
      // chat_id: this.chatId,
      text: message,
      parse_mode: "Markdown",
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
    const menuImageIds = menuImages.data.map((menuImage) => menuImage.id);
    await this.menuImageService.delete(menuImageIds);
  }

  async sendPaymentReminder() {
    const notPaidList = await this.orderService.getNotPaidList();
    const notPaidString = notPaidList
      .map((item) => `*💸 ${item.fullName} - ${item.totalPrice}K*`)
      .join("\n");
    const message = `*Các con nợ sau chưa thanh toán:*\n\n${notPaidString} \n\n💰__Quét QR Code:__ [ở đây](${process.env.PAYMENT_QR_URL})`;
    await this.sendNotificationToTelegram(message);
  }

  async notifyNewFood() {
    const message = `Đã có món mới hôm nay, vào đặt cơm bạn nhé! \n${process.env.FRONT_END_URL}`;
    await this.sendNotificationToTelegram(message);
  }
}
