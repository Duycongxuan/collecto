import { User } from "../entities/users.entity";
import { UpdateUserDto } from "../dto/users/update-user.dto";
import { ChangePasswordDto } from "../dto/users/change-password.dto";
import * as bcrypt from 'bcryptjs';
import { IUserService } from "@/interfaces/services/user.interface";
import { IUserRepository } from "@/interfaces/repositories/user.interface";
import { BadRequestException } from "@/exceptions/app-error";
import { PaginationDto } from "@/dto/pagination/pagination.dto";
import { hashPassword } from "@/utils/passwordUtils";

/**
 * This class contains the business logic related to users.
 * It acts as an intermediary between the controllers and the repository.
 */
export class UserService implements IUserService{
  constructor(
    private readonly userRepo: IUserRepository
  ){}
  /**
   * @param userId 
   * @returns The User object (without password).
   */
  private findUserWithoutPassword = async (userId: number): Promise<Partial<User>> => {
    const user =  await this.userRepo.findByUserId(userId);
    delete user.password;

    return user;
  }

  /**
   * Retrieves the public profile information for a given user.
   * @param userId The ID of the user.
   * @returns The User object (without password).
   */
  public getProfile = async (userId: number): Promise<Partial<User>> => {
    return await this.findUserWithoutPassword(userId);
  }

  /**
   * Retrieves a paginated list of users from the database.
   * @param pagiantion 
   * @returns 
   */
  getAllUser = async (pagiantion?: PaginationDto): Promise<{ items: Partial<User>[], total: number} | string> => {
    return await this.userRepo.findAllUser(pagiantion);
  }

  create = async (data: Partial<User>): Promise<Partial<User>> => {
    const password = await hashPassword(data.phoneNumber!);
    const newUser: Partial<User> = {
      ...data,
      password: password
    }
    const user = await this.userRepo.create(newUser);
    delete user.password;
    return user;
  }

  /**
   * Updates a user's profile information.
   * @param userId The ID of the user to update.
   * @param dto The new data to apply (e.g., name, email).
   * @returns The updated User object.
   * @throws {AppError} 400 if the provided data is the same as the current data.
   */
  update = async (userId: number, dto: UpdateUserDto): Promise<Partial<User>> => {
    // 1. Fetch the original user state before the update.
    const originalUser = await this.userRepo.findByUserId(userId);

    // 2. Check if the submitted data is actually different from the current data.
    const isUnchanged = Object.keys(dto).every(
      (key) => dto[key as keyof UpdateUserDto] === originalUser[key as keyof User]
    );

    if(isUnchanged) {
      throw new BadRequestException('Provided data matches current information. No changes were made.');
    }
    
    // 3. Proceed with the update and return the result.
    await this.userRepo.update(userId, dto);

    return await this.findUserWithoutPassword(userId);
  }

 /**
 * Changes a user's password after validating their old password.
 * @param userId The ID of the user.
 * @param dto An object containing the old password, new password, and confirmation.
 * @returns The updated User object (without the password).
 * @throws {AppError} if the old password is incorrect or the new password is invalid.
 */
  changePassword = async (userId: number, dto: ChangePasswordDto): Promise<string> => {
    // 1. Retrieve the user record, including the current password hash.
    const existingUser = await this.userRepo.findByUserId(userId);

    // 2. Verify the old password.
    const isOldPasswordCorrect = await bcrypt.compare(dto.oldPassword, existingUser.password!);
    if (!isOldPasswordCorrect) {
      throw new BadRequestException('Your old password is incorrect.');
    }

    // 3. Validate the new password.
    if (dto.newPassword === dto.oldPassword) {
      throw new BadRequestException('Your new password must not be the same as the old password.');
    }
    
    if (dto.newPassword !== dto.confirmNewPassword) {
      throw new BadRequestException('Your new password confirmation does not match.');
    }

    // 4. Hash the new password for secure storage.
    //const newPasswordHash = await bcrypt.hash(dto.newPassword, 10);
    const newPasswordHash = await hashPassword(dto.newPassword);

    // 5. Update the user with the new password hash.
    const message = await this.userRepo.changePassword(userId, newPasswordHash);

    return message;
  }
}