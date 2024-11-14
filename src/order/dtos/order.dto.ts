import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, MaxLength } from "class-validator";

export class CreateOrderDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @MaxLength(255)
  items: string;

  @ApiProperty({ required: false })
  isPaid: boolean;

  @ApiProperty({ required: false })
  riceOption: number;
}

export class UpdateOrderDto {
  @ApiProperty({ required: false })
  @IsNumber()
  price: number;

  @ApiProperty({ required: false })
  @MaxLength(255)
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
