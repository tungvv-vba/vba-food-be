import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UserLoginDto, UserRegisterDto } from "src/user/dtos/user.dto";
import { UserService } from "src/user/user.service";
import { ForgetPasswordDto, ResetPasswordDto } from "./auth.dto";
import { MailerService } from "@nestjs-modules/mailer";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async login({ username, password }: UserLoginDto) {
    const user = await this.userService.findOne({ username });
    const badRequest = new BadRequestException("Đăng nhập thất bại");

    if (!user) throw badRequest;

    const isLoginSuccessfully = bcrypt.compareSync(password, user.password);

    if (isLoginSuccessfully) {
      const accessToken = await this.jwtService.signAsync({
        sub: user.id,
        username: user.username,
      });

      return {
        user,
        accessToken,
      };
    }

    throw badRequest;
  }

  async register(body: UserRegisterDto) {
    const { username, password, email } = body;
    const isExistingUser = await this.userService.findOne({ username });
    const isExistingMail = await this.userService.findOne({ email });

    if (isExistingUser) {
      throw new BadRequestException("Tên người dùng đã tồn tại");
    }

    if (isExistingMail) {
      throw new BadRequestException("Email đã được đăng ký");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    body.password = hashedPassword;

    await this.userService.create(body);
    return {
      msg: "Đăng ký thành công",
    };
  }

  async refresh(body) {}

  async forgetPassword({ email }: ForgetPasswordDto) {
    const user = await this.userService.findOne({ email });

    if (!user) {
      throw new BadRequestException("Email chưa được đăng ký");
    }

    const resetPasswordToken = this.genResetPasswordToken();
    await this.userService.update(user.id, { resetToken: resetPasswordToken });
    const resetPasswordUrl = `${this.configService.getOrThrow("FRONT_END_URL")}/reset-password?token=${resetPasswordToken}`;

    this.mailerService.sendMail({
      to: "tung.vu1@vbatechs.com",
      subject: `[VBA Food] Quên mật khẩu`,
      text: `Vui lòng nhấp vào liên kết bên dưới để thiết lập lại mật khẩu:\n ${resetPasswordUrl}`,
    });

    return "Send mail successfully";
  }

  async resetPassword(body: ResetPasswordDto) {
    const { token, password } = body;
    const user = await this.userService.findOne({ resetToken: token });
    if (!user) {
      throw new BadRequestException("Token không hợp lệ");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userService.update(user.id, { password: hashedPassword, resetToken: null });
    return "Reset password successfully";
  }

  genResetPasswordToken() {
    const resetPasswordToken = Math.random().toString(36).slice(2);
    return resetPasswordToken;
  }
}
