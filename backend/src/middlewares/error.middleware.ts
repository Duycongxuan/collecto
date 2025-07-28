import { AppError } from '../utils/app-error';
import { Request, Response, NextFunction } from 'express';

/**
 * Global error handler middleware
 * Handles AppError and generic errors
 */
export const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  // Handle custom AppError
  if (err.name === 'App Error') {
    return res.status(err.statusCode).json({
      status: 'error',
      code: err.statusCode,
      message: err.message
    });
  }

  // Handle generic server errors
  res.status(500).json({
    status: 'error',
    code: 500,
    message: err.message
  });
}