import { PaginationDto } from "@/dto/pagination/pagination.dto";
import { User } from "@/entities/users.entity";

export interface IUserRepository {
  findByUserId(userId: number): Promise<User>;
  findByEmail(email: string): Promise<User>;
  findAllUser(pagiantion?: PaginationDto): Promise<{ items: Partial<User>[], total: number} | string>;
  findByPhoneNumber (phoneNumber: string): Promise<User>;
  create (data: Partial<User>): Promise<User>;
  update(userId: number, data: Partial<User>): Promise<User>;
  changePassword(userId: number, password: string): Promise<string>;
}