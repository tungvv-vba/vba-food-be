import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "menu_images" })
export class MenuImageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;
}
