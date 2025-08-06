import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { logger } from '../config/logger';
import { BadRequestException, InternalException } from '@/exceptions/app-error';

/**
 * Generate a JWT access token for authentication
 * @param payload IPayload - user payload
 * @returns JWT access token string
 * @throws AppError if secret is not configured or token generation fails
 */
export const generateAccessToken = (payload: any): string => {
  try {
    const accessTokenSecret = config.jwt.accessTokenSecret;
    if (!accessTokenSecret) {
      throw new InternalException('JWT access token secret is not configured');
    }

    const tokenPayload = {
      ...payload,
      type: 'access' as const,
      iat: Math.floor(Date.now() / 1000)
    };

    const token = jwt.sign(tokenPayload, accessTokenSecret, {
      expiresIn: config.jwt.accessTokenExpire,
      algorithm: 'HS256',
      issuer: 'collecto',
      audience: 'collecto'
    } as any);
    return token;
  } catch (error) {
    throw new BadRequestException('Generated access token failed');
  }
}

/**
 * Generate a JWT refresh token for session renewal
 * @param payload IPayload - user payload
 * @returns JWT refresh token string
 * @throws AppError if secret is not configured or token generation fails
 */
export const generateRefreshToken = (payload: any): string => {
  try {
    const refreshTokenSecret = config.jwt.refreshTokenSecret;
    
    if (!refreshTokenSecret) {
      throw new InternalException('JWT refresh token secret is not configured');
    }

    const tokenPayload = {
      ...payload,
      type: 'refresh' as const,
      iat: Math.floor(Date.now() / 1000)
    };

    const token = jwt.sign(tokenPayload, refreshTokenSecret, {
      expiresIn: config.jwt.refreshTokenExpire,
      algorithm: 'HS256',
      issuer: 'collecto',
      audience: 'collecto'
    } as any);

    return token;
  } catch (error) {
    throw new BadRequestException('Generated refresh token failed');
  }
}