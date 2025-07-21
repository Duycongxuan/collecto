import { validate } from 'class-validator';
import { plainToClass, ClassConstructor } from 'class-transformer';
import { AppError } from './app-error';

/**
 * Validate and transform plain object to DTO class instance
 * Throws AppError if validation fails
 * @param dtoClass DTO class constructor
 * @param obj Plain object to validate
 * @returns Validated DTO instance
 */
export async function validateDto<T extends object>(
  dtoClass: ClassConstructor<T>, 
  obj: any
): Promise<T> {
  const dto = plainToClass(dtoClass, obj);
  const errors = await validate(dto);

  if (errors.length > 0) {
    const errorMessages = errors.map(error => 
      Object.values(error.constraints || {}).join(', ')
    ).join('; ');
    
    throw new AppError(errorMessages, 400);
  }

  return dto;
}