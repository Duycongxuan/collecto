import { FindManyOptions, IsNull, Repository } from "typeorm";
import { User } from "../entities/users.entity";
import { AppDataSource } from "../config/database";
import { BadRequestException, NotFoundException } from "@/exceptions/app-error";
import { IUserRepository } from "@/interfaces/repositories/user.interface";
import { PaginationDto } from "@/dto/pagination/pagination.dto";

/**
 * Manages all database operations (CRUD) for the User entity.
 */
export class UserRepository implements IUserRepository{
  private userRepository: Repository<User>
  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  /**
   * Finds a user by ID (without the password).
   * @param userId The ID of the user.
   * @returns A User object.
   * @throws {AppError} 404 if the user is not found.
   */
  findByUserId = async (userId: number): Promise<User> => {
    const user = await this.userRepository.findOne({
      where: { id: userId, deletedAt: IsNull() }
    });

    if(!user) {
      throw new NotFoundException(`Not found user with id: ${userId}`);
    }
    return user;
  }

  /**
   * Retrieves a paginated list of users from the database.
   * @param pagination 
   * @returns 
   */
  findAllUser = async (pagination?: PaginationDto): Promise<{ items: Partial<User>[], total: number} | string> => {
    const { page = 1, limit = 10 } = pagination || {};
    const skip = (page - 1) * limit;

    const findOptions: FindManyOptions<User> = {
      select: [ 'id', 'name', 'email', 'phoneNumber', 'dateOfBirth', 'gender', 'rewardPoint'],
      where: { deletedAt: IsNull() },
      order: { createdAt: 'DESC' },
      skip: skip,
      take: limit
    }

    const [items, total] = await this.userRepository.findAndCount(findOptions);
    if(total === 0) {
      return 'There are no users in the system.';
    }
    return { items, total }
  }

  /**
   * Finds a user by email, including the password and other fields.
   * @warning For internal use like login, where the full user object is needed.
   * @param email The user's email.
   * @returns The full User object.
   * @throws {AppError} 404 if the user is not found.
   */
  findByEmail = async (email: string): Promise<User> => {
    const user = await this.userRepository.findOne({
      where: { email: email, deletedAt: IsNull() },
    });

    if(!user) {
      throw new NotFoundException(`Not found user with email: ${email}`);
    }

    return user;
  }

  checkEmail = async (email: string): Promise<User | null> => {
    return await this.userRepository.findOne({
      where: { email, deletedAt: IsNull()}
    })
  } 

  /**
   * Find user by phone number
   * @param phoneNumber 
   * @returns the full User object.
   * @throws {NotFoundException} if not found user
   */
  findByPhoneNumber = async (phoneNumber: string): Promise<User> => {
    const user = await this.userRepository.findOne({
      where: { phoneNumber: phoneNumber, deletedAt: IsNull() }
    });

    if(!user) {
      throw new NotFoundException(`Not found user with phone number: ${phoneNumber}`);
    }
    return user;
  }

  /**
   * Creates and saves a new user to the database.
   * @param data The new user's data (e.g., email, password, name).
   * @returns The newly created User object.
   * @throws {BadRequestException} if Email or phone number is existed
   */
  create = async (data: Partial<User>): Promise<User> => {
    // const { email, phoneNumber } = data;
    // const user = await this.userRepository.createQueryBuilder('users')
    //   .where('users.email = :email', { email: email })
    //   .orWhere('users.phoneNumber = :phoneNumber', { phoneNumber: phoneNumber })

    // if(user){
    //   throw new BadRequestException('Email or phone number is existed in database.');
    // }

    return await this.userRepository.save(this.userRepository.create(data));
  }

  /**
   * Updates a user's information by their ID.
   * @param userId The ID of the user to update.
   * @param data The new data to apply.
   * @returns The updated User object.
   * @throws {AppError} 404 if the user to update is not found.
   */
  update = async(userId: number, data: Partial<User>): Promise<User> => {
    const user = await this.findByUserId(userId);
    Object.assign(user, data);
    return await this.userRepository.save(user);
  }

  changePassword = async (userId: number, password: string): Promise<string> => {
    try {
      const user = await this.findByUserId(userId);
      Object.assign(user, { password: password });
      await this.userRepository.save(user);
      return 'Change password successfully.';
    } catch (error) {
      throw new BadRequestException(`Failed to change password: ${error}`);
    }
  }
}