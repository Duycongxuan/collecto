import { Repository } from "typeorm";
import { User } from "../entities/users.entity";
import { AppDataSource } from "../config/database";
import { AppError } from "../utils/app-error";

/**
 * Manages all database operations (CRUD) for the User entity.
 */
export class UserRepository {
  private userRepository: Repository<User>;

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
      where: { id: userId }
    });

    if(!user) throw new AppError('User not found.', 404);
    return user;
  }

  /**
   * Finds a user by ID, including their password hash.
   * @warning For internal authentication purposes only (e.g., login, password change).
   * @param userId The ID of the user.
   * @returns The User object, including the password.
   * @throws {AppError} 404 if the user is not found.
   */
  findByUserIdWithPassword = async (userId: number): Promise<User> => {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'name', 'email', 'password', 'status']
    });

    if(!user) throw new AppError('User not found.', 404);
    return user;
  }

  /**
   * Finds a user by email, including the password and other fields.
   * @warning For internal use like login, where the full user object is needed.
   * @param email The user's email.
   * @returns The full User object.
   * @throws {AppError} 404 if the user is not found.
   */
  findByEmailWithPassword = async (email: string): Promise<User> => {
    const user =  await this.userRepository.findOne({
      where: { email },
      select: ['id', 'name', 'email', 'password', 'role', 'status', 'createdAt', 'updatedAt', 'deletedAt']
    });

    if(!user) throw new AppError('User not found.', 404);
    return user;
  }

  /**
   * Finds a user by email (without the password).
   * This method returns `null` if the user is not found, it does not throw an error.
   * @param email The user's email.
   * @returns The User object or `null` if not found.
   */
  findByEmailWithoutPassword = async (email: string): Promise<User | null> => {
    return await this.userRepository.findOne({ where: { email: email } });
  }

  /**
   * Creates and saves a new user to the database.
   * @param data The new user's data (e.g., email, password, name).
   * @returns The newly created User object.
   */
  create = async (data: Partial<User>): Promise<User> => {
    // `create` makes a new entity instance, `save` persists it to the DB.
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
    // The `update` method returns a result object, not the updated entity.
    const result = await this.userRepository.update(userId, data);

    // If no rows were affected, it means the user with the given ID was not found.
    if(result.affected === 0) {
        throw new AppError('User to update not found.', 404);
    }
    
    // We must re-fetch the user to return the updated object.
    return await this.findByUserId(userId);
  }
}