import { Response } from 'express';
import { IResponse, IPagination } from '../interfaces/response.interface';

export class ResponseUtil {
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

  static error<T> (
    res: Response,
    message: string,
    code: number,
    error: string
  ):  Response {
    const response: IResponse = {
      status: 'error',
      code,
      message,
      error
    };

    return res.status(code).json(response);
  }

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