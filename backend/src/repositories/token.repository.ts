import { Repository } from 'typeorm';
import { Token } from '../entities/tokens.entity';
import { AppDataSource } from '../config/database';
import { AppError } from '../utils/app-error';
import * as bcrypt from 'bcryptjs';

export class TokenRepository {
  private tokenRepository: Repository<Token>;
  constructor() {
    this.tokenRepository = AppDataSource.getRepository(Token);
  }

  /**
   * Find a token by its raw refresh token value (compare hash)
   * @param refreshToken string - raw refresh token from client
   * @returns Token object or null if not found
   */
  findByRefreshToken = async (refreshToken: string): Promise<Token | null> => {
    // Get all non-revoked tokens
    const tokens = await this.tokenRepository.find({ where: { isRevoked: false } });
    for (const token of tokens) {
      if (token.token && await bcrypt.compare(refreshToken, token.token)) {
        return token;
      }
    }
    return null;
  }

  /**
   * Create a new token in the database
   * @param data Partial<Token> - token data
   * @returns Created Token object
   */
  create = async (data: Partial<Token>): Promise<Token> => {
    const token = await this.tokenRepository.create(data);
    return await this.tokenRepository.save(token);
  }

  /**
   * Update a token in the database
   * @param data Partial<Token> - token data (must include id)
   * @throws AppError if token not found
   */
  update = async (data: Partial<Token>): Promise<void> => {
    const result = await this.tokenRepository.update(data.id!, data);

    if (result.affected === 0) throw new AppError('No token found with the given userId.', 404);
  }
}