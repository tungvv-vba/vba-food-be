import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MenuImageEntity } from "./entities/menu-image.entity";
import { Repository } from "typeorm";
import { promises as fsPromises } from "fs";
import { join } from "path";
import axios from "axios";

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

  async create(files: Array<Express.Multer.File>) {
    const menuImages = files.map((file) => {
      return this.menuImageRepository.create({ url: file.path });
    });
    const message = `Đã có món mới hôm nay, vào đặt cơm bạn nhé!`;
    await this.sendNotifyToTelegram(message);
    return this.menuImageRepository.save(menuImages);
  }

  async delete({ ids, isOff }: { ids: number[]; isOff: boolean }) {
    if (isOff) {
      const message = `Thông báo: hôm nay quán cơm nghỉ nhé mọi người ~~`;
      await this.sendNotifyToTelegram(message);
    }
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

  async sendNotifyToTelegram(message: string) {
    const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
    const payload = {
      chat_id: process.env.TELEGRAM_CHAT_ID,
      text: message,
    };
    try {
      await axios.post(url, payload);
      return "Gửi thông báo thành công";
    } catch (error) {
      throw new BadRequestException("Lỗi khi gửi thông báo");
    }
  }
}
