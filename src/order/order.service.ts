import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderEntity } from "./entities/order.entity";
import { Between, Repository } from "typeorm";
import { OrderDto } from "./dtos/order.dto";
import { UserEntity } from "src/user/entities/user.entity";

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
  ) {}

  findAll(startDate: Date, endDate: Date) {
    return this.orderRepository.find({
      where: { updatedAt: Between(startDate, endDate) },
      relations: {
        user: true,
      },
    });
  }

  findOne(id: number) {
    return this.orderRepository.findOneBy({ id });
  }

  async create(requestBody: OrderDto, currentUser: UserEntity) {
    const order = this.orderRepository.create(requestBody);
    order.userId = currentUser.id;
    return this.orderRepository.save(order);
  }
  update(id: number, newOrder: OrderDto) {
    return this.orderRepository.update(id, newOrder);
  }

  delete(id: number) {
    return this.orderRepository.softDelete(id);
  }

  totalPrice(orders: OrderEntity[]) {
    return orders.reduce((total, order) => total + order.price, 0);
  }

  async findByUserId(userId: number) {
    const [orders, count] = await this.orderRepository.findAndCount({
      where: { userId },
      relations: { user: true },
    });

    return {
      orders: orders.slice(0, 7).reverse(),
      total: this.totalPrice(orders),
      count,
    };
  }
}
