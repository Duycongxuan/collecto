import { NextFunction, Response } from 'express';
import { AuthService } from "../services/auth.service";
import { RegisterDto } from '../dto/auth/register.dto';
import { LoginDto } from '../dto/auth/login.dto';
import { ApiResponse } from '@/utils/response.util';
import { HTTP_STATUS_CODE } from '@/constants';
import { BadRequestException } from '@/exceptions/app-error';
import { IRequest } from '@/interfaces/request.interface';

export class AuthController {

  constructor(
    private readonly authService: AuthService
  ) {}

  /**
   * Handle user registration
   * @route POST /auth/register
   */
  register = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Register new user
      const user = await this.authService.register(req.body as RegisterDto);
      ApiResponse.success(res, user, `Register with email: ${user.email} successfully.`, HTTP_STATUS_CODE.CREATED_SUCCESSFUL);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handle user login
   * @route POST /auth/login
   */
  login = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Authenticate user and generate tokens
      const result = await this.authService.login(req.body as LoginDto);
      // Set refresh token in httpOnly, secure cookie
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: false,
        secure: false,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
      // Return only user and accessToken in response body
      ApiResponse.success(res, {
        user: result.user,
        accessToken: result.accessToken
      }, 'Login successfully.', HTTP_STATUS_CODE.OK);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handle user logout
   * @route POST /auth/logout
   */
  logout = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
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
        throw new BadRequestException('Logout failed: No refresh token provided.');
      }

      // Revoke the refresh token
      await this.authService.logout(req.user?.id!, refreshToken);

      // Clear the refresh token cookie
      res.clearCookie('refreshToken', {
        httpOnly: process.env.NODE_ENV === 'production',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });

      ApiResponse.success(res, null, 'Logout successfully.', HTTP_STATUS_CODE.OK);
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
  resetToken = async(req: IRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      let refreshToken = req.cookies.refreshToken;
      const newAccesstoken = await this.authService.resetToken(req.user?.id!, refreshToken);

      ApiResponse.success(res, newAccesstoken, 'Reset access token successfully.', HTTP_STATUS_CODE.OK);
    } catch (error) {
      next(error);
    }
  }
  
}