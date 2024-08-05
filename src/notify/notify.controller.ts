import { Controller, Post } from "@nestjs/common";
import { NotifyService } from "./notify.service";

@Controller("notify")
export class NotifyController {
  constructor(private notifyService: NotifyService) {}

  @Post("/payment-reminder")
  sendRefundNotification() {
    return this.notifyService.sendPaymentReminder();
  }

  @Post("/offline")
  sendOfflineNotification() {
    return this.notifyService.sendOfflineNotification();
  }
}
