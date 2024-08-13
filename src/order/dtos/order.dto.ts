import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateOrderDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  price: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  items: string;

  @ApiProperty({ required: false })
  isPaid: boolean;

  @ApiProperty({ required: false })
  riceOption: number;
}

export class UpdateOrderDto {
  @ApiProperty({ required: false })
  price: number;

  @ApiProperty({ required: false })
  items: string;

  @ApiProperty({ required: false })
  isPaid: boolean;

  @ApiProperty({ required: false })
  riceOption: number;
}

export class FindOrderDto {
  @ApiProperty({ required: true })
  date?: string;

  @ApiProperty({ required: false })
  isPaid: boolean;
}
