import { AppError } from '../utils/app-error';
import { logger } from '../config/logger';
import { NextFunction, Request, Response } from 'express';
import { config } from '../config/env';
import jwt from 'jsonwebtoken';
import { ICustomRequest } from '../interfaces/request.interface';
import { UserRepository } from '../repositories/users.repository';
import { Role } from '../utils/enum';
import { ResponseUtil } from '../utils/response.util';

/**
 * Contains middleware for handling Authentication and Authorization.
 */
export class AuthMiddleWare {
  private userRepository: UserRepository;
  constructor() {
    this.userRepository = new UserRepository();
  }

  /**
   * Authenticates a user by validating their JWT access token from the Authorization header.
   * If valid, it attaches the full user object to the request.
   *
   * @throws {AppError} if the token is missing, malformed, or invalid.
   */
  authenticate = async (req: ICustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // 1. Get the Authorization header and check for 'Bearer' format.
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new AppError('Access token is required for authentication.', 401);
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
      // Common errors caught here include TokenExpiredError, JsonWebTokenError, etc.
      logger.error('Authentication failed: ', error);
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
    return (req: ICustomRequest, res: Response, next: NextFunction) => {
     try {
      // Ensure the `authenticate` middleware has already run.
      if (!req.user) {
        return ResponseUtil.error(res, 'User not authenticated.', 401);
      }

      // Check if the user's role is included in the list of allowed roles.
      if (!roles.includes(req.user?.role as Role)) {
        // Log unauthorized access attempts for security monitoring.
        logger.warn('Authorization failed: Insufficient permissions', {
          userId: req.user?.id!,
          userRole: req.user?.role,
          requiredRoles: roles
        });
        return ResponseUtil.error(res, 'You do not have permission to perform this action.', 403);
      }
      
      // If the role is valid, allow the request to proceed.
      next();
     } catch (error) {
      logger.error(`Authorization error: ${ error }`)
      next(error);
     }
    };
  }
}