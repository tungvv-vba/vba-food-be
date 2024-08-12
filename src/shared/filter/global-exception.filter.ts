import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Response } from "express";
import { CustomException } from "../exception/custom.exception";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    console.log(exception);
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "Internal server error";
    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      message = exception.message;
    }
    this.logger.error({ message: exception.message, stack: exception.stack });

    const errorBody = {
      error: {
        code: statusCode,
        message: message,
      },
      statusCode: statusCode,
      timestamp: new Date().toISOString(),
    };

    response.status(statusCode).json(errorBody);
  }
}
