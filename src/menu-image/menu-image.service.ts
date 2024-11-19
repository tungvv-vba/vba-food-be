import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FileService } from "src/file/file.service";
import { Between, FindOptionsWhere, Repository } from "typeorm";
import { FindMenuImageDto } from "./dtos/menu-image.dto";
import { MenuImageEntity } from "./entities/menu-image.entity";

@Injectable()
export class MenuImageService {
  constructor(
    @InjectRepository(MenuImageEntity) private menuImageRepository: Repository<MenuImageEntity>,
    private fileService: FileService,
  ) {}

  async findAll(query?: FindMenuImageDto) {
    const where: FindOptionsWhere<MenuImageEntity> = {};
    if (query?.date) {
      const startDate = new Date(query.date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(query.date);
      endDate.setHours(23, 59, 59, 999);

      where.createdAt = Between(startDate, endDate);
    }

    const data = await this.menuImageRepository.findBy(where);

    return { data };
  }

  async findOne(id: number) {
    return this.menuImageRepository.findOneBy({ id });
  }

  async create(files: Array<Partial<Express.Multer.File>>) {
    const menuImages = files.map((file) => {
      return this.fileService.uploadFileToPublicBucket(file);
    });
    const images = await Promise.all(menuImages);
    return this.menuImageRepository.save(images);
  }

  async delete(ids: number[]) {
    if (!ids || ids.length === 0) return;
    const idList = [ids].flat();
    for (const id of idList) {
      const image = await this.findOne(id);
      if (image?.key) {
        await this.fileService.deleteFileFromPublicBucket(image.key);
      }
    }
    return this.menuImageRepository.delete(ids);
  }
}
