import { SALT } from '@/constants';
import bcrypt from 'bcryptjs';

export const hashPassword = async (password: string) => {
  return await bcrypt.hashSync(password, SALT);
}

export const verifyPassword = async (password: string, hashedPassword: string ): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
}