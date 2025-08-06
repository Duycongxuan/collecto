import { IConfig } from '@/interfaces/index.interfaces';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Exported configuration object
export const config: IConfig = {
  app: {
    port: parseInt(process.env.PORT || '3000'),
    nodeEnv: process.env.NODE_ENV
  },
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    dbName: process.env.DB_NAME
  },
  jwt: {
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    accessTokenExpire: process.env.ACCESS_TOKEN_EXPIRE,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
    refreshTokenExpire: process.env.REFRESH_TOKEN_EXPIRE
  },
  cloudinary: {
    name: process.env.CLOUDINARY_NAME,
    key: process.env.CLOUDINARY_KEY,
    secret: process.env.CLOUDINARY_SECRET
  }
}