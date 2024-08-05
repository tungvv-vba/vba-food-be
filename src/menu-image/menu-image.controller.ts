import {
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import { MenuImageService } from "./menu-image.service";
import { ApiTags } from "@nestjs/swagger";

@Controller("menu-image")
@ApiTags("menu-image")
export class MenuImageController {
  constructor(private menuImageService: MenuImageService) {}

  @Get()
  findAll() {
    return this.menuImageService.findAll();
  }

  @Post()
  @UseInterceptors(
    FilesInterceptor("images", 10, {
      storage: diskStorage({
        destination: "./uploads", // Thư mục lưu trữ
        filename: (_, file, cb) => {
          // Định dạng tên file để tránh trùng lặp
          const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname); // Lấy phần mở rộng của file
          cb(null, `${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  uploadMultiple(@UploadedFiles() files: Array<Express.Multer.File>) {
    return this.menuImageService.create(files);
  }

  @Delete()
  deleteFiles(@Query("ids") ids: number[]) {
    return this.menuImageService.delete(ids);
  }
}
