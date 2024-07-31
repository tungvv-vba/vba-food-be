import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class MenuImageDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  url: string;
}
