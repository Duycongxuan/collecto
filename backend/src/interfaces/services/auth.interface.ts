import { LoginDto } from "@/dto/auth/login.dto";
import { RegisterDto } from "@/dto/auth/register.dto"
import { User } from "@/entities/users.entity"

export interface IAuthService {
  register(data: RegisterDto): Promise<User>;
  login(data: LoginDto): Promise<User>;
  logout(userId: number, refreshToken: string): Promise<string>;
  resetToken(userId: number, refreshToken: string): Promise<string>
}