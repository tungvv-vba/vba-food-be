import { ExceptionFilter, Catch, ArgumentsHost, Logger } from "@nestjs/common";
import { Response } from "express";
import { CustomException } from "../exception/custom.exception";

@Catch(CustomException)
export class CustomExceptionFiler implements ExceptionFilter {
  private logger = new Logger(CustomExceptionFiler.name);
  catch(exception: CustomException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    this.logger.error({
      message: exception.error.message,
      code: exception.error.code,
    });

    const errorBody = {
      error: exception.error,
      statusCode: exception.statusCode,
      timestamp: new Date().toISOString(),
    };
    response.status(exception.statusCode).json(errorBody);
  }
}
