import { Repository } from 'typeorm';
import { Token } from '../entities/tokens.entity';
import { AppDataSource } from '../config/database';
import * as bcrypt from 'bcryptjs';
import { BadRequestException, NotFoundException } from '@/exceptions/app-error';
import { ITokenRepository } from '@/interfaces/repositories/token.interface';

export class TokenRepository implements ITokenRepository{
  private readonly tokenRepository: Repository<Token>;
  constructor() {
    this.tokenRepository = AppDataSource.getRepository(Token);
  }

  /**
   * Find a token by its raw refresh token value (compare hash)
   * @param refreshToken string - raw refresh token from client
   * @returns Token object or null if not found
   */
  findByRefreshToken = async (userId: number, refreshToken: string): Promise<Token | null> => {
    // Get all non-revoked tokens
    const tokens = await this.tokenRepository.find({ where: { userId: userId,  isRevoked: false } });
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
  revokedRefreshToken = async (userId: number, refreshToken: string): Promise<string> => {
    const token = await this.findByRefreshToken(userId, refreshToken);
    if(token) {
      try {
        Object.assign(token, { isReVoked: true });
        await this.tokenRepository.save(token);
        return 'Revoked refresh token successfully.';
      } catch (error) {
        throw new BadRequestException(`Failed to revoked refresh token: ${error}`);
      }
    } else {
      throw new NotFoundException('Not found refresh token or Rvoked.');
    }
  }

  revokeAllRefreshTokens = async (userId: number): Promise<string> => {
    try {
      const tokens = await this.tokenRepository.find({ 
        where: { userId, isRevoked: false }
      });

      if (tokens.length === 0) {
        return 'All refresh tokens are already revoked.';
      }

      await this.tokenRepository.manager.transaction(async (transactionalEntityManager) => {
        for (const token of tokens) {
          await transactionalEntityManager.update(
            this.tokenRepository.target,
            { id: token.id, isRevoked: false },
            { isRevoked: true }
          );
        }
      });

      return 'All refresh tokens have been revoked.';
    } catch (error) {
      throw new Error('Failed to revoke refresh tokens: ' + error);
    }
  }

}