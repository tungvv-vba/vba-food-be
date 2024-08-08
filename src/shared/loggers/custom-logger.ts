import { Logger } from "@nestjs/common";

export class CustomException {
  private readonly logger: Logger;
  private readonly context: string;
  constructor(context: string) {
    this.context = context;
    this.logger = new Logger(context);
  }

  log(data: string) {
    if (typeof data === "string") {
      this.logger.log(data);
    } else {
      this.logger.log(data, this.context);
    }
  }

  error(data: string) {
    if (typeof data === "string") {
      this.logger.error(data);
    } else {
      this.logger.error(data, this.context);
    }
  }
}
