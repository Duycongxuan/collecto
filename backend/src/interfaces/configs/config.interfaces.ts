interface IAppConfig {
  port?: number;
  nodeEnv?: string;
}

// Database configuration interface
interface IDBConfig {
  host?: string,
  port?: number,
  username?: string,
  password?: string,
  dbName?: string
}

// JWT configuration interface
interface IJwtConfig {
  accessTokenSecret?: string,
  accessTokenExpire?: string,
  refreshTokenSecret?: string,
  refreshTokenExpire?: string
}

// Cloudinary configuration interface
interface ICloudinaryConfig {
  name?: string;
  key?: string;
  secret?: string;
}

// Main config interface
export interface IConfig {
  app: IAppConfig,
  database: IDBConfig,
  jwt: IJwtConfig,
  cloudinary: ICloudinaryConfig
}