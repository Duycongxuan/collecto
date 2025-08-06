import { logger } from '@/config/logger';
import { Response } from 'express';
export class ApiResponse {
  /**
   * Send a success response
   * @param res Express Response object
   * @param data Response data
   * @param message Success message
   * @param code HTTP status code
   */
  static success<T> (res: Response, data: T, message: string, code: number): Response {
    const response = {
      status: 'success',
      code,
      message,
      data
    }
    logger.info(message);
    return res.status(code).json(response);
  }
  /**
   * Send a paginated response
   * @param res Express Response object
   * @param data Array of data
   * @param page Current page number
   * @param limit Items per page
   * @param total Total items
   * @param message Success message
   */
  static paginated<T> (res: Response, data: T[], page: number, limit: number, total: number, message: string
  ): Response {
    const response= {
      status: 'success',
      code: 200,
      message,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPage: Math.ceil(total / limit),
      }
    }
    logger.info(message)
    return res.status(200).json(response);
  }
}