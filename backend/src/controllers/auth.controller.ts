import { NextFunction, Request, Response } from 'express'
import { AuthService } from "../services/auth.service";
import { ResponseUtil } from '../utils/response.util';
import { logger } from '../config/logger';
import { validateDto } from '../utils/validation';
import { RegisterDto } from '../dto/auth/register.dto';
import { LoginDto } from '../dto/auth/login.dto';
import { ICustomRequest } from '../interfaces/request.interface';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Handle user registration
   * @route POST /auth/register
   */
  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validate and transform request body to RegisterDto
      const data = await validateDto(RegisterDto, req.body);
      // Register new user
      const user = await this.authService.register(data);
      logger.info('New user: ', user);
      ResponseUtil.success(res, user, 'Register successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handle user login
   * @route POST /auth/login
   */
  login = async (req: ICustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validate and transform request body to LoginDto
      const data = await validateDto(LoginDto, req.body);
      // Authenticate user and generate tokens
      const result = await this.authService.login(data);
      logger.info('User login: ', result.user.id);
      // Set refresh token in httpOnly, secure cookie
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: false,
        secure: false,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
      // Return only user and accessToken in response body
      ResponseUtil.success(res, {
        user: result.user,
        accessToken: result.accessToken
      }, 'Login successfully.', 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handle user logout
   * @route POST /auth/logout
   */
  logout = async (req: ICustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Get refresh token from cookie or Authorization header
      let refreshToken = '';
      if (req.cookies && req.cookies.refreshToken) {
        refreshToken = req.cookies.refreshToken;
      } else if (req.headers['x-refresh-token']) {
        refreshToken = req.headers['x-refresh-token'] as string;
      } else if (req.body && req.body.refreshToken) {
        refreshToken = req.body.refreshToken;
      }
      
      if (!refreshToken) {
        logger.warn('Logout failed: No refresh token provided.');
        ResponseUtil.error(res, 'No refresh token provided.', 400, 'Missing refresh token');
        return;
      }

      // Revoke the refresh token
      await this.authService.logout(refreshToken);

      // Clear the refresh token cookie
      res.clearCookie('refreshToken', {
        httpOnly: process.env.NODE_ENV === 'production',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });

      logger.info('Logout successfully.');
      ResponseUtil.success(res, null, 'Logout successfully.', 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handle access token reset using a valid refresh token
   * @route POST /auth/reset-token
   * Requires authentication middleware
   * Returns a new access token if the refresh token is valid
   */
  resetToken = async(req: ICustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      let refreshToken = req.cookies.refreshToken;
      const newAccesstoken = await this.authService.resetToken(refreshToken);

      logger.info('Reset access token successfully.', req.user?.id);
      ResponseUtil.success(res, newAccesstoken, 'Reset access token successfully.', 200);
    } catch (error) {
      next(error);
    }
  }
  
}