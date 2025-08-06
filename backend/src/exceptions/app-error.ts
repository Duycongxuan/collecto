import { HTTP_STATUS_CODE } from "@/constants";

export abstract class Exception extends Error {
  public readonly statusCode: number;
  public readonly isOptional: boolean;
  public readonly errorCode: string;

  constructor(message: string, statusCode: number, errorCode: string) {
    super(message);
    this.statusCode = statusCode;
    this.isOptional = true;
    this.errorCode = errorCode;
    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundException extends Exception {
  constructor(message: string) {
    super(message, HTTP_STATUS_CODE.NOT_FOUND, 'NOT_FOUND')
  }
}

export class BadRequestException extends Exception {
  constructor(message: string){
    super(message, HTTP_STATUS_CODE.BAD_REQUEST, 'BAD_REQUEST')
  }
}

export class ForbiddenException extends Exception {
  constructor(message: string = 'Access forbiden') {
    super(message, HTTP_STATUS_CODE.FORBIDDEN, 'FORBIDDEN');
  }
}

export class UnauthorizedException extends Exception {
  constructor(message: string = 'Unauthorized access') {
    super(message, HTTP_STATUS_CODE.UNAUTHORIZE, 'UNAUTHORIZED');
  }
}

export class ConflictException extends Exception {
  constructor(message: string) {
    super(message, HTTP_STATUS_CODE.CONFLICT, 'CONFLICT');
  } 
}

export class InternalException extends Exception {
  constructor(message: string) {
    super(message, HTTP_STATUS_CODE.INTERNAL, 'INTERNAL')
  }
}