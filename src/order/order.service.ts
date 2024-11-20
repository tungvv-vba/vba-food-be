import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderEntity } from "./entities/order.entity";
import { Between, FindOptionsWhere, Repository } from "typeorm";
import { CreateOrderDto, FindOrderDto, UpdateOrderDto } from "./dtos/order.dto";
import { UserEntity } from "src/user/entities/user.entity";

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
  ) {}

  async findAll(query: FindOrderDto) {
    const where: FindOptionsWhere<OrderEntity> = { isPaid: query.isPaid };
    if (query.date) {
      const startDate = new Date(query.date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(query.date);
      endDate.setHours(23, 59, 59, 999);

      where.createdAt = Between(startDate, endDate);
    }

    const data = await this.orderRepository.find({
      where,
      relations: {
        user: true,
      },
      order: { price: "DESC" },
    });

    return { data };
  }

  async findOne(id: number) {
    return this.orderRepository.findOneBy({ id });
  }

  async create(requestBody: CreateOrderDto, currentUser: UserEntity) {
    const order = this.orderRepository.create(requestBody);
    order.userId = currentUser.id;
    return this.orderRepository.save(order);
  }

  async update(id: number, newOrder: UpdateOrderDto, currentUser: UserEntity) {
    const order = await this.findOne(id);
    if (order.userId !== currentUser.id) {
      throw new BadRequestException("Không thể chỉnh sửa order của người khác");
    }
    if (newOrder.isPaid) {
      throw new BadRequestException("Dừng lại ngay! Chỉ admin mới có quyền update bạn đã trả tiền");
    }
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
      orders: orders.reverse().slice(0, 7),
      total: this.totalPrice(orders),
      count,
      notPaid: this.totalPrice(orders.filter((order) => !order.isPaid)),
    };
  }

  updatePaid(ids: number[]) {
    return this.orderRepository.update(ids, { isPaid: true });
  }

  async getNotPaidList() {
    const notPaidList = await this.orderRepository
      .createQueryBuilder("order")
      .select("order.userId", "userId")
      .addSelect("user.fullName", "fullName")
      .addSelect("SUM(order.price)", "totalPrice")
      .leftJoin("order.user", "user")
      .where("order.isPaid = :isPaid", { isPaid: false })
      .groupBy("order.userId")
      .addGroupBy("user.fullName")
      .getRawMany();

    return notPaidList;
  }
}
