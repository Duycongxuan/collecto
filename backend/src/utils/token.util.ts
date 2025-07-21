import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { logger } from '../config/logger';
import { AppError } from './app-error';
import { IPayload } from '../interfaces/payload.interface';

/**
 * Generate a JWT access token for authentication
 * @param payload IPayload - user payload
 * @returns JWT access token string
 * @throws AppError if secret is not configured or token generation fails
 */
export const generateAccessToken = (payload: IPayload): string => {
  try {
    const accessTokenSecret = config.jwt.accessTokenSecret;
    if (!accessTokenSecret) {
      throw new AppError('JWT access token secret is not configured', 500);
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

    logger.info('Generated access token successfully');
    return token;
  } catch (error) {
    logger.error('Generated access token failed: ', error);
    throw new AppError('Generated access token failed', 400);
  }
}

/**
 * Generate a JWT refresh token for session renewal
 * @param payload IPayload - user payload
 * @returns JWT refresh token string
 * @throws AppError if secret is not configured or token generation fails
 */
export const generateRefreshToken = (payload: IPayload): string => {
  try {
    const refreshTokenSecret = config.jwt.refreshTokenSecret;
    
    if (!refreshTokenSecret) {
      throw new AppError('JWT refresh token secret is not configured', 500);
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

    logger.info('Generated refresh token successfully');
    return token;
  } catch (error) {
    logger.error('Generated refresh token failed: ', error);
    throw new AppError('Generated refresh token failed', 400);
  }
}