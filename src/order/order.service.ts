import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderEntity } from "./entities/order.entity";
import { Between, Repository } from "typeorm";
import { OrderDto } from "./dtos/order.dto";

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
  ) {}

  findAll(startDate: Date, endDate: Date) {
    return this.orderRepository.find({
      where: { updatedAt: Between(startDate, endDate) },
    });
  }

  findOne(id: number) {
    return this.orderRepository.findOneBy({ id });
  }

  create(body: OrderDto, userId: number) {
    const newOrder = this.orderRepository.create({ ...body, userId });
    return this.orderRepository.save(newOrder);
  }

  update(id: number, newOrder: OrderDto) {
    return this.orderRepository.update(id, newOrder);
  }

  delete(id: number) {
    return this.orderRepository.softDelete(id);
  }

  async findByUserId(userId: number) {
    return 1
  }
}
