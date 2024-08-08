import { HttpStatus } from "@nestjs/common";

export class CustomException extends Error {
  constructor(statusCode: HttpStatus, response: { code: any; message: string }) {
    super();
    this.statusCode = statusCode;
    this.response = response;
  }
  statusCode: HttpStatus;
  response: { code: any; message: string };
}
