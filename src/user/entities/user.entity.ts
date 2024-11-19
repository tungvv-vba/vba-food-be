import { Exclude } from "class-transformer";
import { OrderEntity } from "src/order/entities/order.entity";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export enum ERole {
  USER = "USER",
  ADMIN = "ADMIN",
}

@Entity({ name: "users" })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  fullName: string;

  @Exclude()
  @Column()
  password: string;

  @Column()
  email: string;

  @Column({ name: "reset_token", nullable: true })
  resetToken: string;

  @Column({
    type: "enum",
    default: ERole.USER,
    enum: ERole,
  })
  role: string;

  @Column({ nullable: true, name: "avatar_url" })
  avatarUrl?: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt: Date;

  @OneToMany(() => OrderEntity, (order) => order.user)
  orders: OrderEntity[];
}
