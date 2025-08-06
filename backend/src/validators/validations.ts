import { IRequest } from '@/interfaces/request.interface';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Response, NextFunction } from 'express';

type Requestpath = 'body' | 'params' | 'query'

export function validationMiddleware<T extends object>(dtoClass: new () => T, property: Requestpath = 'body') {
  return async (req: IRequest, res: Response, next: NextFunction) => {
    const dtoInstance = plainToInstance(dtoClass, req[property]);
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.map(err => ({
          property: err.property,
          constraints: err.constraints,
        })),
      });
    }

    req[property] = dtoInstance;

    next();
  };
}