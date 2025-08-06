import { ChangePasswordDto } from "@/dto/users/change-password.dto";
import { UpdateUserDto } from "@/dto/users/update-user.dto";
import { User } from "@/entities/users.entity";

export interface IUserService {
  create(user: Partial<User>): Promise<Partial<User>>;
  getProfile(userId: number): Promise<Partial<User>>;
  update(userId: number, dto: UpdateUserDto): Promise<User>;
  changePassword(userId: number, dto: ChangePasswordDto): Promise<string>;
}