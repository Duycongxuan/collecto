import dotenv from 'dotenv';
dotenv.config({ path: '.env'});

interface AppConfig {
  port?: number;
  nodeEnv?: string;
}

interface DBConfig {
  host?: string,
  port?: number,
  username?: string,
  password?: string,
  dbName?: string
}

interface Config {
  app: AppConfig,
  database: DBConfig
}

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
  }
}