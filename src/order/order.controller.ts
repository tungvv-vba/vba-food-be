import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseInterceptors,
} from "@nestjs/common";
import { OrderDto } from "./dtos/order.dto";
import { OrderService } from "./order.service";

@Controller("order")
@UseInterceptors(ClassSerializerInterceptor)
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get("/")
  findAll(@Query("date") date: string) {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    return this.orderService.findAll(startDate, endDate);
  }

  @Get("/:id")
  findOne(@Param("id") id: number) {
    return this.orderService.findOne(id);
  }

  @Post()
  create(@Body() body: OrderDto, @Req() req) {
    return this.orderService.create(body, req.user.sub);
  }

  @Put("/:id")
  update(@Param("id") id: number, @Body() newOrder: OrderDto) {
    return this.orderService.update(id, newOrder);
  }

  @Delete("/:id")
  delete(@Param("id") id: number) {
    return this.orderService.delete(id);
  }

  @Get("/report")
  getReport() {
    return this.orderService.findByUserId(2);
  }
}
