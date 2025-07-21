/**
 * Custom application error class for consistent error handling
 */
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, code: number) {
    super(message);
    this.statusCode = code;
    this.isOperational = true;
    this.name = 'App Error'

    Error.captureStackTrace(this, this.constructor);
  }
}