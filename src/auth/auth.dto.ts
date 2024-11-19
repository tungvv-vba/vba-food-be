import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class RefreshTokenDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  accessToken: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}

export class ForgetPasswordDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => value?.toLowerCase()?.trim())
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  token: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  password: string;
}
