import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UserLoginDto, UserRegisterDto } from "src/user/dtos/user.dto";
import { UserService } from "src/user/user.service";
import { ForgetPasswordDto } from "./auth.dto";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login({ username, password }: UserLoginDto) {
    const user = await this.userService.findOne(username);
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
    const { username, password } = body;
    const isExistingUser = await this.userService.findOne(username);

    if (isExistingUser) {
      throw new BadRequestException("Tên người dùng đã tồn tại");
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
    // const user = await this.userService.findOneByEmail(email);

    // if (!user) {
    //   throw new BadRequestException("Không tìm thấy người dùng");
    // }
  }
}
