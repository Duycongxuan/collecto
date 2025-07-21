import { AppError } from '../utils/app-error';
import { logger } from '../config/logger';
import { NextFunction, Request, Response } from 'express';
import { config } from '../config/env';
import jwt from 'jsonwebtoken';
import { ICustomRequest } from '../interfaces/request.interface';
import { UserRepository } from '../repositories/users.repository';

export class AuthMiddleWare {
  private userRepository: UserRepository;
  constructor() {
    this.userRepository = new UserRepository();
  }

  /**
   * Middleware to authenticate user using JWT access token
   * Adds user object to request if valid
   * @throws AppError if token is missing or invalid
   */
  authenticate = async (req: ICustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Get Authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new AppError('Access token is required', 401);
      }

      // Extract token from header
      const token = authHeader.substring(7);
      // Verify JWT token
      const payload = await jwt.verify(token, config.jwt.accessTokenSecret!);

      // Find user by ID from token payload
      const user = await this.userRepository.findByUserId(Number(payload.sub));
      
      req.user = user!;
      next();
    } catch (error) {
      logger.error('Unauthenticated: ', error);
      next(error);
    }
  }
}