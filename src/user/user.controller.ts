import { Body, Controller, Get, Post } from "@nestjs/common";
import { ChangePasswordDto } from "./dtos/change-password.dto";
import { UserService } from "./user.service";
import { currentUser } from "./decorator/currentUser.decorator";
import { UserEntity } from "./entities/user.entity";

@Controller("user")
export class UserController {
  constructor(private readonly userSrrvice: UserService) {}

  @Get("/")
  getHello(): string {
    return "Hello World!";
  }

  @Post("/change-password")
  async changePassword(@Body() request: ChangePasswordDto, @currentUser() currentUser: UserEntity) {
    return await this.userSrrvice.changePassword(request, currentUser);
  }
}
