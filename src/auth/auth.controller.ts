import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Public } from "src/constants";
import { UserLoginDto, UserRegisterDto } from "src/user/dtos/user.dto";
import { ForgetPasswordDto, ResetPasswordDto } from "./auth.dto";
import { AuthService } from "./auth.service";

@Public()
@ApiTags("authentication")
@Controller("/")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  login(@Body() body: UserLoginDto) {
    return this.authService.login(body);
  }

  @Post("register")
  register(@Body() body: UserRegisterDto) {
    return this.authService.register(body);
  }

  @Post("refresh")
  refresh(@Body() body: UserRegisterDto) {
    return this.authService.refresh(body);
  }

  @Post("forget-password")
  forgetPassword(@Body() body: ForgetPasswordDto) {
    return this.authService.forgetPassword(body);
  }

  @Post("reset-password")
  resetPassword(@Body() body: ResetPasswordDto) {
    return this.authService.resetPassword(body);
  }
}
