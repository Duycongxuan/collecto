import { NextFunction, Response } from 'express';
import { config } from '../config/env';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/users.repository';
import { Role } from '../enums/enum';
import { ForbiddenException, UnauthorizedException } from '@/exceptions/app-error';
import { IRequest } from '@/interfaces/request.interface';

/**
 * Contains middleware for handling Authentication and Authorization.
 */
export class AuthMiddleWare {
  constructor(
    private userRepository: UserRepository
  ) {}

  /**
   * Authenticates a user by validating their JWT access token from the Authorization header.
   * If valid, it attaches the full user object to the request.
   *
   * @throws {AppError} if the token is missing, malformed, or invalid.
   */
  authenticate = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // 1. Get the Authorization header and check for 'Bearer' format.
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedException('Access token is required for authentication.');
      }

      // 2. Extract the token from the "Bearer <token>" string.
      const token = authHeader.substring(7);

      // 3. Verify the token's signature. `jwt.verify` will throw an error if it's invalid.
      const payload = jwt.verify(token, config.jwt.accessTokenSecret!) as { sub: string };

      // 4. Critical step: Fetch the user from the database to ensure they still exist and are active.
      const user = await this.userRepository.findByUserId(Number(payload.sub));
      
      // 5. Attach the user object to the request for use in subsequent handlers.
      req.user = user!;
      next();
    } catch (error) {
      next(error); // Pass the error to the global error handler.
    }
  }

  /**
   * A higher-order function that returns a middleware for role-based authorization.
   * This should be used *after* the `authenticate` middleware.
   *
   * @example `router.get('/admin-dashboard', authMiddleware.authorize([Role.ADMIN]), ...)`
   * @param roles An array of roles that are permitted to access the route.
   */
  authorize = (roles: Role[]) => {
    return (req: IRequest, res: Response, next: NextFunction) => {
     try {
      // Ensure the `authenticate` middleware has already run.
      if (!req.user) {
        throw new UnauthorizedException('User not authenticated.');
      }

      // Check if the user's role is included in the list of allowed roles.
      if (!roles.includes(req.user?.role as Role)) {
        throw new ForbiddenException('You do not have permission to perform this action.');
      }
      
      // If the role is valid, allow the request to proceed.
      next();
     } catch (error) {
      next(error);
     }
    };
  }
}