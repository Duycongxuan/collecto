import {Request, Response, NextFunction} from 'express';
import { logger } from '../config/logger';
import { ResponseUtil } from '../utils/response.util';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(
    'Error occured: ', {
      message: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method
    }
  );

  return ResponseUtil.error(res, 'Internal Server Error', 500, err.message);
}