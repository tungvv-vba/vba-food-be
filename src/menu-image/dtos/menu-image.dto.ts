import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class MenuImageDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  url: string;
}

export class FindMenuImageDto {
  @ApiProperty({ required: false })
  @IsOptional()
  date?: string;
}
