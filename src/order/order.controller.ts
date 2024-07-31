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
  UseInterceptors,
} from "@nestjs/common";
import { OrderDto } from "./dtos/order.dto";
import { OrderService } from "./order.service";
import { CurrentUser } from "src/user/decorator/currentUser.decorator";
import { UserEntity } from "src/user/entities/user.entity";
import { ApiTags } from "@nestjs/swagger";

@Controller("order")
@ApiTags("order")
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

  @Get("/report")
  getReport(@CurrentUser() currentUser: UserEntity) {
    return this.orderService.findByUserId(currentUser.id);
  }

  @Get(":id")
  findOne(@Param("id") id: number) {
    return this.orderService.findOne(id);
  }

  @Post()
  create(@Body() body: OrderDto, @CurrentUser() currentUser: UserEntity) {
    return this.orderService.create(body, currentUser);
  }

  @Put("/:id")
  update(@Param("id") id: number, @Body() newOrder: OrderDto) {
    return this.orderService.update(id, newOrder);
  }

  @Delete("/:id")
  delete(@Param("id") id: number) {
    return this.orderService.delete(id);
  }
}
