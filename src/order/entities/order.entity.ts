import { Exclude, Transform } from "class-transformer";
import { UserEntity } from "src/user/entities/user.entity";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export enum OrderOption {
  Option1 = "ít cơm",
  Option2 = "vừa cơm",
  Option3 = "nhiều cơm",
}
@Entity({ name: "orders" })
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  price: number;

  @Column({
    length: 255,
  })
  items: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn()
  deletedAt: Date;

  @Column()
  userId: number;

  @Column({ type: "enum", enum: OrderOption, default: OrderOption.Option2 })
  option: OrderOption;

  @ManyToOne(() => UserEntity, (user) => user.orders)
  @JoinColumn({ name: "userId" })
  @Transform(({ value }) => value.fullName)
  user: UserEntity;

  @Column({ default: false })
  isPaid: boolean;
}
