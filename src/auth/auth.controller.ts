import { Body, ClassSerializerInterceptor, Controller, Post, UseInterceptors, ValidationPipe } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserLoginDto, UserRegisterDto } from "src/user/dtos/user.dto";
import { Public } from "src/constants";

@Public()
@UseInterceptors(ClassSerializerInterceptor)
@Controller("/")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  login(@Body(new ValidationPipe()) body: UserLoginDto) {
    return this.authService.login(body);
  }

  @Post("register")
  register(@Body(new ValidationPipe()) body: UserRegisterDto) {
    return this.authService.register(body);
  }
}
