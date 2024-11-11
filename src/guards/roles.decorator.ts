import { SetMetadata } from "@nestjs/common";
import { ERole } from "src/user/entities/user.entity";

export const ROLES_KEY = "roles";
export const Roles = (...roles: ERole[]) => SetMetadata(ROLES_KEY, roles);
