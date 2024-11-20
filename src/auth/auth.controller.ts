import { Body, Controller, Post, Req, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";
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
  async login(@Body() body: UserLoginDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken, user } = await this.authService.login(body);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 365 * 24 * 60 * 60 * 1000,
    });
    return { accessToken, user };
  }

  @Post("register")
  register(@Body() body: UserRegisterDto) {
    return this.authService.register(body);
  }

  @Post("refresh")
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken, user } = await this.authService.refresh({
      refreshToken: req.cookies.refreshToken,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 365 * 24 * 60 * 60 * 1000,
    });
    return { accessToken, user };
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
