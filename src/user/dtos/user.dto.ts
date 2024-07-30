import { IsNotEmpty, MinLength } from "class-validator";
import { ERole } from "../entities/user.entity";

export class UserLoginDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}

export class UserRegisterDto {
  @IsNotEmpty()
  @MinLength(3, {
    message: "username tối thiểu 3 ký tự",
  })
  username: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @MinLength(6, {
    message: "Họ tên tối thiểu 2 ký tự",
  })
  fullname: string;

  role: ERole;
}
