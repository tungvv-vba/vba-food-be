import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MenuImageEntity } from "./entities/menu-image.entity";
import { Repository } from "typeorm";
import { promises as fsPromises } from "fs";
import { join } from "path";
import { NotifyService } from "src/notify/notify.service";
import { IPageResponse } from "./interface/IPageResponse";
import { OrderEntity } from "src/order/entities/order.entity";

@Injectable()
export class MenuImageService {
  constructor(
    @InjectRepository(MenuImageEntity) private menuImageRepository: Repository<MenuImageEntity>,
    private notifyService: NotifyService,
  ) {}

  async findAll() {
    const data = await this.menuImageRepository.find();
    return { data };
  }

  async findOne(id: number) {
    return this.menuImageRepository.findOneBy({ id });
  }

  async create(files: Array<Express.Multer.File>) {
    const menuImages = files.map((file) => {
      return this.menuImageRepository.create({ url: file.path });
    });
    await this.notifyService.notifyNewFood();
    return this.menuImageRepository.save(menuImages);
  }

  async delete(ids: number[]) {
    if (!ids || ids.length === 0) return;
    for (const id of ids) {
      const image = await this.findOne(id);
      if (image?.url) {
        await this.deleteFile(image.url);
      }
    }
    return this.menuImageRepository.delete(ids);
  }

  async deleteFile(path: string) {
    const filePath = join(__dirname, "..", "..", path);

    try {
      await fsPromises.unlink(filePath);
      return { message: "File deleted successfully" };
    } catch (err) {
      throw new Error("Error deleting file");
    }
  }
}
