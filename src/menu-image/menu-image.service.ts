import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MenuImageEntity } from "./entities/menu-image.entity";
import { Repository } from "typeorm";
import { promises as fsPromises } from "fs";
import { join } from "path";

@Injectable()
export class MenuImageService {
  constructor(
    @InjectRepository(MenuImageEntity) private menuImageRepository: Repository<MenuImageEntity>,
  ) {}

  findAll() {
    return this.menuImageRepository.find();
  }

  async findOne(id: number) {
    return this.menuImageRepository.findOneBy({ id });
  }

  create(files: Array<Express.Multer.File>) {
    const menuImages = files.map((file) => {
      return this.menuImageRepository.create({ url: file.path });
    });

    return this.menuImageRepository.save(menuImages);
  }

  async delete(ids: number[]) {
    for (const id of ids) {
      const { url } = await this.findOne(id);
      await this.deleteFile(url);
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
