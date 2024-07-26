import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { Repository } from "typeorm";
import { UserRegisterDto } from "./dtos/user.dto";

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
}
