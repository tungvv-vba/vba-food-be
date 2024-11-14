import { Body, Controller, Get, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { ChangePasswordDto } from "./dtos/change-password.dto";
import { UserService } from "./user.service";
import { CurrentUser } from "./decorator/currentUser.decorator";
import { UserEntity } from "./entities/user.entity";
import { ApiTags } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import * as multer from "multer";
const storage = multer.memoryStorage();

@Controller("user")
@ApiTags("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("/")
  getHello(): string {
    return "Hello World!";
  }

  @Post("/change-password")
  async changePassword(@Body() request: ChangePasswordDto, @CurrentUser() currentUser: UserEntity) {
    return await this.userService.changePassword(request, currentUser);
  }

  @Post("change/avatar")
  @UseInterceptors(FileInterceptor("file", { storage }))
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() currentUser: UserEntity,
  ) {
    return await this.userService.uploadFile(file, currentUser);
  }
}
