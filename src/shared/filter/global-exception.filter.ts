import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Response } from "express";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
    }
    this.logger.error({ message: exception.message, stack: exception.stack });

    const errorBody = {
      ...exception.response,
      message: exception?.response?.message || "Internal Server Error",
      timestamp: new Date().toISOString(),
    };

    response.status(statusCode).json(errorBody);
  }
}
