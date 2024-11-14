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

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt: Date;

  @Column()
  userId: number;

  @ManyToOne(() => UserEntity, (user) => user.orders)
  @JoinColumn({ name: "userId" })
  @Transform(({ value }) => value.fullName)
  user: UserEntity;

  @Column({ default: false, name: "is_paid" })
  isPaid: boolean;

  @Column({ default: 2, name: "rice_option" })
  riceOption: number;
}
