import { Request } from 'express';
import { User } from "@/entities/users.entity";

export interface IRequest extends Request {
  user?: User;
  file?: Express.Multer.File;
}