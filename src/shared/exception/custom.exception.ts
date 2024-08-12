import { HttpStatus } from "@nestjs/common";

export class CustomException extends Error {
  constructor(statusCode: HttpStatus, error: { code: any; message: string }) {
    super();
    this.statusCode = statusCode;
    this.error = error;
  }
  statusCode: HttpStatus;
  error: { code: any; message: string };
}
