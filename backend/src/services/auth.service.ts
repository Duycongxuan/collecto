import { RegisterDto } from "../dto/auth/register.dto";
import { AppError } from "../utils/app-error";
import { User } from "../entities/users.entity";
import { UserRepository } from "../repositories/users.repository";
import * as bcrypt from 'bcryptjs'
import { LoginDto } from "../dto/auth/login.dto";
import { generateAccessToken, generateRefreshToken } from "../utils/token.util";
import { IPayload } from "../interfaces/payload.interface";
import { TokenRepository } from "../repositories/token.repository";
import { logger } from '../config/logger'; // Add logger import
import { Status } from '../utils/enum'; // Import Status enum
import { config } from "../config/env";
import jwt from 'jsonwebtoken';

export class AuthService {
  private userRepository: UserRepository;
  private tokenRepository: TokenRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.tokenRepository = new TokenRepository();
  }

  /**
   * Register a new user
   * @param dto RegisterDto - registration data
   * @returns User object without password
   * @throws AppError if user already exists or passwords do not match
   */
  register = async (dto: RegisterDto): Promise<User> => {
    // Check if user already exists by email
    const existingUser = await this.userRepository.findByEmailWithoutPassword(dto.email);
    if (existingUser) throw new AppError('User already exists with this email.', 409);

    // Check if password and confirmPassword match
    if (dto.confirmPassword !== dto.password) throw new AppError('Your confirm password is incorrect.', 400);

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(dto.password!, 10);

    const newUser = {
      email: dto.email,
      password: hashedPassword
    };

    // Create user in database
    const user = await this.userRepository.create(newUser);

    // Remove password before returning user object
    delete user.password;
    return user;
  }

  /**
   * Login user and generate tokens
   * @param dto LoginDto - login data
   * @returns Object containing user, accessToken, and refreshToken
   * @throws AppError if user not found, password is incorrect, or account is not active
   */
  login = async (dto: LoginDto): Promise<any> => {
    // Find user by email (with password)
    const user = await this.userRepository.findByEmailWithPassword(dto.email);
    if (!user) {
      logger.warn(`Login failed: No user found with email ${dto.email}`);
      throw new AppError('No user found with this email.', 404);
    }

    // Check user status
    if (user.status === Status.BAN) {
      logger.warn(`Login failed: User ${user.email} is banned.`);
      throw new AppError('Your account has been banned. Please contact support.', 403);
    }
    if (user.status === Status.DELETED) {
      logger.warn(`Login failed: User ${user.email} is deleted.`);
      throw new AppError('Your account has been deleted.', 403);
    }
    if (user.status !== Status.ACTIVE) {
      logger.warn(`Login failed: User ${user.email} is not active.`);
      throw new AppError('Your account is not active.', 403);
    }

    // Compare provided password with hashed password
    const isPasswordMatch = await bcrypt.compare(dto.password, user.password!);
    if (!isPasswordMatch) {
      logger.warn(`Login failed: Incorrect password for user ${user.email}`);
      throw new AppError('Your password is incorrect. Please enter again.', 400);
    }

    // Remove sensitive fields before returning user object
    const { password, ...safeUser } = user;

    // Prepare JWT payload
    const payload: IPayload = {
      sub: user.id!,
      email: user.email!,
      role: user.role!,
    }

    // Generate access and refresh tokens
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Hash the refresh token before saving to DB
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    const tokenToSave = {
      userId: user.id!,
      token: hashedRefreshToken,
      expireAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days expiry
    }

    // Save hashed refresh token to database
    await this.tokenRepository.create(tokenToSave);
    logger.info(`User ${user.email} logged in successfully.`);
    return {
      user: safeUser, // Only return safe fields
      accessToken: accessToken,
      refreshToken: refreshToken
    }
  }

  /**
   * Logout user by revoking their refresh token
   * @param refreshToken string - refresh token from client (cookie/header)
   */
  logout = async (refreshToken: string): Promise<void> => {
    // Find the token in the database by refresh token value
    const token = await this.tokenRepository.findByRefreshToken(refreshToken);
    if (!token) {
      logger.warn('Logout failed: Refresh token not found or already revoked.');
      throw new AppError('Invalid or expired refresh token.', 400);
    }
    if (token.isRevoked) {
      logger.warn('Logout: Token already revoked.');
      return;
    }
    // Mark the token as revoked
    const updatedToken = {
      ...token,
      isRevoked: true
    }
    // Update token in database
    await this.tokenRepository.update(updatedToken);
    logger.info(`Logout successful for userId: ${token.userId}`);
  }

  /**
   * Reset access token using a valid refresh token
   * @param refreshToken string - refresh token from client
   * @returns New access token
   * @throws AppError if token is invalid, revoked, or expired
   */
  resetToken = async (refreshToken: string): Promise<string> => {
    // Find the token in the database by refresh token value
    const token = await this.tokenRepository.findByRefreshToken(refreshToken);
    if (!token) {
      logger.warn('Logout failed: Refresh token not found or already revoked.');
      throw new AppError('Invalid or expired refresh token.', 400);
    }
    if (token.isRevoked) {
      logger.warn('Logout: Token already revoked.');
      throw new AppError('Refresh token has already revoked.', 400);
    }
    // Check if refresh token is expired
    if (token.expireAt && token.expireAt < new Date()) {
      logger.warn('Refresh token expired.');
      throw new AppError('Refresh token has expired.', 400);
    }

    // Decode and validate the refresh token
    const decoded = jwt.verify(refreshToken, config.jwt.refreshTokenSecret!);
    if (typeof decoded !== "object" || !decoded.sub || !decoded.email || !decoded.role) {
      throw new AppError("Invalid refresh token payload.", 400);
    }
    // Prepare payload for new access token
    const payload: IPayload = {
      sub: Number(decoded.sub),
      email: decoded.email,
      role: decoded.role,
    };
    // Generate new access token
    const accessToken = generateAccessToken(payload);
    return accessToken;
  }
}