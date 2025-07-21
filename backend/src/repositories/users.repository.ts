import { Repository } from "typeorm";
import { User } from "../entities/users.entity";
import { AppDataSource } from "../config/database";

export class UserRepository {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  /**
   * Find a user by their user ID
   * @param userId number - user ID
   * @returns User object or null if not found
   */
  findByUserId = async (userId: number): Promise<User | null> => {
    return await this.userRepository.findOne({
      where: { id: userId }
    });
  }

  /**
   * Find a user by email, including password and other sensitive fields
   * @param email string - user email
   * @returns User object or null if not found
   */
  findByEmailWithPassword = async (email: string): Promise<User | null> => {
    return await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'role', 'status', 'createdAt', 'updatedAt', 'deletedAt']
    })
  }

  /**
   * Find a user by email, excluding password
   * @param email string - user email
   * @returns User object or null if not found
   */
  findByEmailWithoutPassword = async (email: string): Promise<User | null> => {
    return await this.userRepository.findOne({ where: { email: email } })
  }

  /**
   * Create a new user in the database
   * @param data Partial<User> - user data
   * @returns Created User object
   */
  create = async (data: Partial<User>): Promise<User> => {
    return await this.userRepository.save(await this.userRepository.create(data));
  }
}