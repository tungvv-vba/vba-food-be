import { Controller, Post } from "@nestjs/common";
import { NotifyService } from "./notify.service";
import { Roles } from "src/guards/roles.decorator";
import { ERole } from "src/user/entities/user.entity";

@Controller("notify")
export class NotifyController {
  constructor(private notifyService: NotifyService) {}

  @Post("/payment-reminder")
  @Roles(ERole.ADMIN)
  sendRefundNotification() {
    return this.notifyService.sendPaymentReminder();
  }

  @Post("/offline")
  @Roles(ERole.ADMIN)
  sendOfflineNotification() {
    return this.notifyService.sendOfflineNotification();
  }
}
