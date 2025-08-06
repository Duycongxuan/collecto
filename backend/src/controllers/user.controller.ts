import { Response, NextFunction } from 'express';
import { IUserService } from '@/interfaces/services/user.interface';
import { ApiResponse } from '@/utils/response.util';
import { HTTP_STATUS_CODE } from '@/constants';
import { CreateUserDto } from '@/dto/users/create-user.dto';
import { UpdateUserDto } from '@/dto/users/update-user.dto';
import { ChangePasswordDto } from '@/dto/users/change-password.dto';
import { IRequest } from '@/interfaces/request.interface';

/**
 * Handles HTTP requests related to users.
 * Its role is to receive requests, call the appropriate service method,
 * and send back a formatted response.
 */
export class UserController {
  
  constructor(
    private userService: IUserService
  ){}

  /**
   * Handle the POST request to create new User
   */
  create = async (req: IRequest,  res: Response, next: NextFunction): Promise<void> => {
    try {
      const newUser = await this.userService.create(req.body as CreateUserDto);
      ApiResponse.success(res, newUser, `Create new user with id ${newUser.id} successdully.`, HTTP_STATUS_CODE.CREATED_SUCCESSFUL);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handles the GET request to retrieve the authenticated user's profile.
   */
  getProfile = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Call the service to get profile data using the user ID from the auth token.
      const profile = await this.userService.getProfile(req.user?.id!);

      ApiResponse.success(res, profile, 'Get profile successfully.', 200);
    } catch (error) {
      // Pass any caught errors to the global error handler.
      next(error);
    }
  }

  /**
   * Handles the PUT/PATCH request to update a user's profile.
   */
  update = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Call the service to perform the update.
      const updatedUser = await this.userService.update(req.user?.id!, req.body as UpdateUserDto);

      // Log success and send the response.
      ApiResponse.success(res, updatedUser, `Update user with id ${updatedUser.id} successfully.`, 200) // Corrected typo "successfullu"
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handles the POST request to change a user's password.
   */
  changePassword = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Call the service to handle the password change logic.
      const message = await this.userService.changePassword(req.user?.id!, req.body as ChangePasswordDto);
      
      // Log success and send the response.
      ApiResponse.success(res, null, message, 200);
    } catch (error) {
      next(error);
    }
  }
}