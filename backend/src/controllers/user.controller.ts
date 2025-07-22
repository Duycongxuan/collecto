import { Response, NextFunction } from 'express';
import { ICustomRequest } from "../interfaces/request.interface";
import { UserService } from "../services/users.service";
import { ResponseUtil } from '../utils/response.util';
import { logger } from '../config/logger';
import { validateDto } from '../utils/validation';
import { UpdateUserDto } from '../dto/users/update-user.dto';
import { ChangePasswordDto } from '../dto/users/change-password.dto';

/**
 * Handles HTTP requests related to users.
 * Its role is to receive requests, call the appropriate service method,
 * and send back a formatted response.
 */
export class UserController {
  private userService : UserService;
  constructor(){
    this.userService = new UserService();
  }

  /**
   * Handles the GET request to retrieve the authenticated user's profile.
   */
  getProfile = async (req: ICustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Call the service to get profile data using the user ID from the auth token.
      const profile = await this.userService.getProfile(req.user?.id!);

      // Log success and send the response.
      logger.info(`Get profile successfully for userId: ${profile.id}`);
      ResponseUtil.success(res, profile, 'Get profile successfully.', 200);
    } catch (error) {
      // Pass any caught errors to the global error handler.
      next(error);
    }
  }

  /**
   * Handles the PUT/PATCH request to update a user's profile.
   */
  update = async (req: ICustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validate the incoming request body against the DTO.
      const data = await validateDto(UpdateUserDto, req.body);

      // Call the service to perform the update.
      const updatedUser = await this.userService.update(req.user?.id!, data);

      // Log success and send the response.
      logger.info(`Updated user successfully for userId: ${req.user?.id!}`);
      ResponseUtil.success(res, updatedUser, 'Updated user successfully.', 200) // Corrected typo "successfullu"
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handles the POST request to change a user's password.
   */
  changePassword = async (req: ICustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validate the incoming password data against the DTO.
      const data = await validateDto(ChangePasswordDto, req.body);
      
      // Call the service to handle the password change logic.
      const updatedUser = await this.userService.changePassword(req.user?.id!, data);
      
      // Log success and send the response.
      logger.info(`Change password successfully for userId: ${req.user?.id}`);
      ResponseUtil.success(res, updatedUser, 'Change password successfully.', 200);
    } catch (error) {
      next(error);
    }
  }
}