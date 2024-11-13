import {
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ApiTags } from "@nestjs/swagger";
import { Roles } from "src/guards/roles.decorator";
import { ERole } from "src/user/entities/user.entity";
import { FindMenuImageDto } from "./dtos/menu-image.dto";
import { MenuImageService } from "./menu-image.service";

@Controller("menu-image")
@ApiTags("menu-image")
export class MenuImageController {
  constructor(private menuImageService: MenuImageService) {}

  @Get()
  findAll(@Query() query: FindMenuImageDto) {
    return this.menuImageService.findAll(query);
  }

  @Post()
  @Roles(ERole.ADMIN)
  @UseInterceptors(FilesInterceptor("images", 10))
  uploadMultiple(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /(image\/jpeg|image\/jpg|image\/png)/ }),
        ],
      }),
    )
    files: Array<Express.Multer.File>,
  ) {
    return this.menuImageService.create(files);
  }

  @Delete()
  deleteFiles(@Query("ids") ids: number[]) {
    return this.menuImageService.delete(ids);
  }
}
