import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Roles } from "src/guards/roles.decorator";
import { CurrentUser } from "src/user/decorator/currentUser.decorator";
import { ERole, UserEntity } from "src/user/entities/user.entity";
import { CreateOrderDto, FindOrderDto, UpdateOrderDto } from "./dtos/order.dto";
import { OrderService } from "./order.service";

@Controller("order")
@ApiTags("order")
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
  @Roles(ERole.ADMIN)
  updatePaid(@Query("ids") ids: number[]) {
    return this.orderService.updatePaid(ids);
  }

  @Put("/:id")
  update(
    @Param("id") id: number,
    @Body() newOrder: UpdateOrderDto,
    @CurrentUser() currentUser: UserEntity,
  ) {
    return this.orderService.update(id, newOrder, currentUser);
  }

  @Delete("/:id")
  delete(@Param("id") id: number) {
    return this.orderService.delete(id);
  }
}
