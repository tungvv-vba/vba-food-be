import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { Repository } from "typeorm";
import { UserRegisterDto } from "./dtos/user.dto";
import { ChangePasswordDto } from "./dtos/change-password.dto";
import { comparePasswordHash, hashPassword } from "src/utils/password.util";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  findAll() {
    return this.userRepository.find();
  }

  findOne(username: string) {
    return this.userRepository.findOneBy({ username });
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
    const { password, oldpassword } = request;
    const user = await this.findOne(currentUser.username);
    if (!user) throw new NotFoundException("Không tìm thấy user");
    const isPasswordValid = await comparePasswordHash(oldpassword, user.password);
    if (!isPasswordValid) throw new BadRequestException("Mật khẩu cũ không đúng");
    const hashPasswords = await hashPassword(password);
    await this.userRepository.save({
      ...user,
      hashPasswords,
    });
    return {
      success: true,
      message: "Đổi mật khẩu thành công",
    };
  }
}
