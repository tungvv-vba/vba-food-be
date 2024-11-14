import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { Repository } from "typeorm";
import { UserRegisterDto } from "./dtos/user.dto";
import { ChangePasswordDto } from "./dtos/change-password.dto";
import { lastValueFrom } from "rxjs";
import * as FormData from "form-data";
import { comparePasswordHash, hashPassword } from "src/shared/utils/password.util";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private httpService: HttpService,
  ) {}

  findAll() {
    return this.userRepository.find();
  }

  findOne(username: string) {
    return this.userRepository.findOneBy({ username });
  }

  findOneByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }
  create(body: UserRegisterDto) {
    const newUser = this.userRepository.create(body);
    return this.userRepository.save(newUser);
  }

  update() {
    return "update user";
  }

  delete(id: string) {
    return this.userRepository.softDelete(id);
  }

  async changePassword(request: ChangePasswordDto, currentUser: UserEntity) {
    const { password, oldPassword } = request;
    const user = await this.findOne(currentUser.username);
    if (!user) throw new NotFoundException("Không tìm thấy user");
    const isPasswordValid = await comparePasswordHash(oldPassword, user.password);
    if (!isPasswordValid) throw new BadRequestException("Mật khẩu cũ không đúng");
    const newPassword = await hashPassword(password);
    await this.userRepository.save({
      ...user,
      password: newPassword,
    });
    return {
      success: true,
      message: "Đổi mật khẩu thành công",
    };
  }
  async uploadFile(file: Express.Multer.File, currentUser: UserEntity): Promise<any> {
    const formData = new FormData();
    formData.append("image", file.buffer.toString("base64"));
    formData.append("key", process.env.IMGBB_API_KEY);

    const headers = {
      ...formData.getHeaders(),
    };

    const response = await lastValueFrom(
      this.httpService.post("https://api.imgbb.com/1/upload", formData, { headers }),
    );
    await this.userRepository.update({ id: currentUser.id }, { avatarUrl: response.data.data.url });
    return {
      url: response.data.data.url,
    };
  }
}
