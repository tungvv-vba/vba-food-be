import { IsNotEmpty } from "class-validator";

export class OrderDto {
  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  items: string;
}

export class FindOrderDto {
  date: string;
}
