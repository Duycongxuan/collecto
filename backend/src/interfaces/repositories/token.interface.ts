import { Token } from "@/entities/tokens.entity";

export interface ITokenRepository {
  findByRefreshToken (userId: number, refreshToken: string): Promise<Token | null>;
  create(data: Partial<Token>): Promise<Token>;
  revokedRefreshToken(userId: number, refreshToken: string): Promise<string>;
  revokeAllRefreshTokens(userId: number): Promise<string>;
}