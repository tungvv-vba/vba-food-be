import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";
import { OrderOption } from "../entities/order.entity";

export class CreateOrderDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  price: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  items: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(OrderOption)
  option: OrderOption;

  @ApiProperty({ required: false })
  isPaid: boolean;
}

export class UpdateOrderDto {
  @ApiProperty({ required: false })
  price: number;

  @ApiProperty({ required: false })
  items: string;

  @ApiProperty({ required: false })
  isPaid: boolean;
}

export class FindOrderDto {
  @ApiProperty({ required: true })
  date?: string;

  @ApiProperty({ required: false })
  isPaid: boolean;
}
