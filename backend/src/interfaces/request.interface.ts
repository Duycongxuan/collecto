import { Request } from 'express';
import { User } from '../entities/users.entity';

export interface ICustomRequest extends Request {
  user?: User;
}
