import { Response } from 'express';
import { IResponse, IPagination } from '../interfaces/response.interface';

export class ResponseUtil {
  /**
   * Send a success response
   * @param res Express Response object
   * @param data Response data
   * @param message Success message
   * @param code HTTP status code
   */
  static success<T> (
    res: Response,
    data: T,
    message: string,
    code: number
  ): Response {
    const response: IResponse = {
      status: 'success',
      code,
      message,
      data
    }
    return res.status(code).json(response);
  }

  /**
   * Send an error response
   * @param res Express Response object
   * @param message Error message
   * @param code HTTP status code
   * @param error Error details
   */
  static error<T> (
    res: Response,
    message: string,
    code: number,
    error?: string
  ):  Response {
    const response: IResponse = {
      status: 'error',
      code,
      message,
      error
    };

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
  static paginated<T> (
    res: Response,
    data: T[],
    page: number,
    limit: number,
    total: number,
    message: string
  ): Response {
    const response: IPagination<T[]> = {
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
    return res.status(200).json(response);
  }
}