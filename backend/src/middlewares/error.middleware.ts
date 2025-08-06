import { logger } from '@/config/logger';
import { Exception } from '@/exceptions/app-error'; 
import { IRequest } from '@/interfaces/request.interface';
import { Response, NextFunction } from 'express';

/**
 * Global error handler middleware
 * Handles AppError and generic errors
 */
export const errorHandler = (err: Exception, req: IRequest, res: Response, next: NextFunction) => {
  logger.error('Error occurred', {
    code: err.statusCode,
    status: 'Error',
    method: req.method,
    stack: err.stack,
    message: err.message
  });

  // Handle custom AppError
  if(err instanceof Exception) {
    return res.status(err.statusCode).json({
      code: err.statusCode,
      status: 'Error',
      message: err.message
    });
  }

  // Handle generic server errors
  res.status(500).json({
    status: 'error',
    code: 500,
    message: 'Internal server error'
  });
}