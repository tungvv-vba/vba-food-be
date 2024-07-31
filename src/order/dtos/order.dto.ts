import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class OrderDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  price: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  items: string;
}

export class FindOrderDto {
  @ApiProperty({ required: true })
  date: string;
}
