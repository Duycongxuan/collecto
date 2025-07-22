import { UserRepository } from "../repositories/users.repository";
import { User } from "../entities/users.entity";
import { UpdateUserDto } from "../dto/users/update-user.dto";
import { AppError } from "../utils/app-error";
import { ChangePasswordDto } from "../dto/users/change-password.dto";
import * as bcrypt from 'bcryptjs';

/**
 * This class contains the business logic related to users.
 * It acts as an intermediary between the controllers and the repository.
 */
export class UserService {
  private userRepository: UserRepository
  constructor(){
    this.userRepository = new UserRepository();
  }

  /**
   * Retrieves the public profile information for a given user.
   * @param userId The ID of the user.
   * @returns The User object (without password).
   */
  getProfile = async (userId: number): Promise<User> => {
    return await this.userRepository.findByUserId(userId);
  }

  /**
   * Updates a user's profile information.
   * @param userId The ID of the user to update.
   * @param dto The new data to apply (e.g., name, email).
   * @returns The updated User object.
   * @throws {AppError} 400 if the provided data is the same as the current data.
   */
  update = async (userId: number, dto: UpdateUserDto): Promise<User> => {
    // 1. Fetch the original user state before the update.
    const originalUser = await this.userRepository.findByUserId(userId);

    // 2. Check if the submitted data is actually different from the current data.
    const isUnchanged = Object.keys(dto).every(
      (key) => dto[key as keyof UpdateUserDto] === originalUser[key as keyof User]
    );

    if(isUnchanged) {
      throw new AppError('Provided data matches current information. No changes were made.', 400);
    }
    
    // 3. Proceed with the update and return the result.
    return await this.userRepository.update(userId, dto);
  }

 /**
 * Changes a user's password after validating their old password.
 * @param userId The ID of the user.
 * @param dto An object containing the old password, new password, and confirmation.
 * @returns The updated User object (without the password).
 * @throws {AppError} if the old password is incorrect or the new password is invalid.
 */
  changePassword = async (userId: number, dto: ChangePasswordDto): Promise<User> => {
    // 1. Retrieve the user record, including the current password hash.
    const existingUser = await this.userRepository.findByUserIdWithPassword(userId);

    // 2. Verify the old password.
    const isOldPasswordCorrect = await bcrypt.compare(dto.oldPassword, existingUser.password!);
    if (!isOldPasswordCorrect) {
      throw new AppError('Your old password is incorrect.', 400);
    }

    // 3. Validate the new password.
    if (dto.newPassword === dto.oldPassword) {
      throw new AppError('Your new password must not be the same as the old password.', 400);
    }
    if (dto.newPassword !== dto.confirmNewPassword) {
      throw new AppError('Your new password confirmation does not match.', 400);
    }

    // 4. Hash the new password for secure storage.
    const newPasswordHash = await bcrypt.hash(dto.newPassword, 10);

    // 5. Update the user with the new password hash.
    const updatedUser = await this.userRepository.update(userId, { password: newPasswordHash });
    
    // 6. Securely remove the password field before sending the user object back to the client.
    delete updatedUser.password; 

    return updatedUser;
  }
}