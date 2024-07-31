import { Body, Controller, Get, Post } from "@nestjs/common";
import { ChangePasswordDto } from "./dtos/change-password.dto";
import { UserService } from "./user.service";
import { CurrentUser } from "./decorator/currentUser.decorator";
import { UserEntity } from "./entities/user.entity";
import { ApiTags } from "@nestjs/swagger";

@Controller("user")
@ApiTags("user")
export class UserController {
  constructor(private readonly userSrrvice: UserService) {}

  @Get("/")
  getHello(): string {
    return "Hello World!";
  }

  @Post("/change-password")
  async changePassword(@Body() request: ChangePasswordDto, @CurrentUser() currentUser: UserEntity) {
    return await this.userSrrvice.changePassword(request, currentUser);
  }
}
