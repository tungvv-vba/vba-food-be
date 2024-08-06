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
import { CreateOrderDto, FindOrderDto, UpdateOrderDto } from "./dtos/order.dto";
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
  findAll(@Query() query: FindOrderDto) {
    return this.orderService.findAll(query);
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
  create(@Body() body: CreateOrderDto, @CurrentUser() currentUser: UserEntity) {
    return this.orderService.create(body, currentUser);
  }

  @Put("/paid")
  updatePaid(@Query("ids") ids: number[]) {
    return this.orderService.updatePaid(ids);
  }

  @Put("/:id")
  update(@Param("id") id: number, @Body() newOrder: UpdateOrderDto) {
    return this.orderService.update(id, newOrder);
  }

  @Delete("/:id")
  delete(@Param("id") id: number) {
    return this.orderService.delete(id);
  }
}
