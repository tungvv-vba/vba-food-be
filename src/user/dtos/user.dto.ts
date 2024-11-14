import { IsEmail, IsNotEmpty, IsOptional, MinLength } from "class-validator";
import { ERole } from "../entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";

export class UserLoginDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  password: string;
}

export class UserRegisterDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @MinLength(3, {
    message: "username tối thiểu 3 ký tự",
  })
  username: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @ApiProperty({ required: false })
  @IsOptional()
  avatarUrl: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  password: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @MinLength(2, {
    message: "Họ tên tối thiểu 2 ký tự",
  })
  fullName: string;

  @ApiProperty({ required: false })
  role: ERole;
}
