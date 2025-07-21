import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Application configuration interface
interface AppConfig {
  port?: number;
  nodeEnv?: string;
}

// Database configuration interface
interface DBConfig {
  host?: string,
  port?: number,
  username?: string,
  password?: string,
  dbName?: string
}

// JWT configuration interface
interface JwtConfig {
  accessTokenSecret?: string,
  accessTokenExpire?: string,
  refreshTokenSecret?: string,
  refreshTokenExpire?: string
}

// Main config interface
interface Config {
  app: AppConfig,
  database: DBConfig,
  jwt: JwtConfig
}

// Exported configuration object
export const config: Config = {
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
  }
}