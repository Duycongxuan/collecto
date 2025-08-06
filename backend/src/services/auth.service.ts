import { logger } from '@/config/logger';
import { LoginDto } from '@/dto/auth/login.dto';
import { RegisterDto } from '@/dto/auth/register.dto';
import { User } from '@/entities/users.entity';
import { Status } from '@/enums/enum';
import { BadRequestException, ConflictException, ForbiddenException } from '@/exceptions/app-error';
import { TokenRepository } from '@/repositories/token.repository';
import { UserRepository } from '@/repositories/users.repository';
import { hashPassword, verifyPassword } from '@/utils/passwordUtils';
import { generateAccessToken, generateRefreshToken } from '@/utils/token.util';
import * as bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import { config } from '@/config/env';
import { IAuthService } from '@/interfaces/services/auth.interface';
export class AuthService implements IAuthService{

  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenRepository: TokenRepository
  ) {}

  /**
   * Register a new user
   * @param dto RegisterDto - registration data
   * @returns User object without password
   * @throws AppError if user already exists or passwords do not match
   */
  register = async (dto: RegisterDto): Promise<User> => {
    // Check if user already exists by email
    const existingUser = await this.userRepository.checkEmail(dto.email);
    if (existingUser) throw new ConflictException('User already exists with this email.');

    // Check if password and confirmPassword match
    if (dto.confirmPassword !== dto.password) throw new BadRequestException('Your confirm password is incorrect.');

    // Hash the password before saving
    const hashedPassword = await hashPassword(dto.password);

    const newUser = {
      name: dto.name,
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
    const user = await this.userRepository.findByEmail(dto.email);

    // Check user status
    if (user.status === Status.BAN) {
      throw new ForbiddenException('Your account has been banned. Please contact support.');
    }
    if (user.status === Status.DELETED) {
      throw new ForbiddenException('Your account has been deleted.');
    }

    // Compare provided password with hashed password
    const isPasswordMatch = await verifyPassword(dto.password, user.password!);
    if (!isPasswordMatch) {
      throw new BadRequestException('Your password is incorrect. Please enter again.');
    }
    // Remove sensitive fields before returning user object
    delete user.password;

    //Revoke all old refreshToken in database
    const message = await this.tokenRepository.revokeAllRefreshTokens(user.id!);
    logger.info(`${message} with id: ${user.id!}`);

    // Prepare JWT payload
    const payload = {
      sub: user.id!,
      email: user.email!,
      role: user.role!,
    }

    // Generate access and refresh tokens
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Hash the refresh token before saving to DB
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 12);

    const tokenToSave = {
      userId: user.id!,
      token: hashedRefreshToken,
      expireAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days expiry
    }

    // Save hashed refresh token to database
    await this.tokenRepository.create(tokenToSave);
    logger.info(`User ${user.email} logged in successfully.`);
    return {
      user, // Only return safe fields
      accessToken: accessToken,
      refreshToken: refreshToken
    }
  }

  /**
   * Logout user by revoking their refresh token
   * @param refreshToken string - refresh token from client (cookie/header)
   */
  logout = async (userId: number, refreshToken: string): Promise<string> => {
    // Find the token in the database by refresh token value
    const token = await this.tokenRepository.findByRefreshToken(userId, refreshToken);
    if (!token) {
      throw new BadRequestException('Invalid or expired refresh token.');
    }

    if (token.isRevoked) {
      logger.warn('Logout: Token already revoked.');
      return 'Logout: Token already revoked.';
    }
 
    // Update token in database
    const message = await this.tokenRepository.revokedRefreshToken(userId, refreshToken);
    return `Logout successful for userId: ${token.userId}`;
  }

  /**
   * Reset access token using a valid refresh token
   * @param refreshToken string - refresh token from client
   * @returns New access token
   * @throws AppError if token is invalid, revoked, or expired
   */
  resetToken = async (userId: number, refreshToken: string): Promise<string> => {
    // Find the token in the database by refresh token value
    const token = await this.tokenRepository.findByRefreshToken(userId, refreshToken);
    if (!token) {
      throw new BadRequestException('Invalid or expired refresh token.');
    }
    if (token.isRevoked) {
      throw new BadRequestException('Refresh token has already revoked.');
    }
    // Check if refresh token is expired
    if (token.expireAt && token.expireAt < new Date()) {
      throw new BadRequestException('Refresh token has expired.');
    }

    // Decode and validate the refresh token
    const decoded = jwt.verify(refreshToken, config.jwt.refreshTokenSecret!);
    if (typeof decoded !== "object" || !decoded.sub || !decoded.email || !decoded.role) {
      throw new BadRequestException('Invalid refresh token payload.')
    }
    // Prepare payload for new access token
    const payload = {
      sub: Number(decoded.sub),
      email: decoded.email,
      role: decoded.role,
    };
    // Generate new access token
    const accessToken = generateAccessToken(payload);
    return accessToken;
  }
}