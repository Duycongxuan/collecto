import { DataSource } from 'typeorm';
import { config } from './env';
import { User } from '../entities/users.entity';
import { Token } from '../entities/tokens.entity';
import { Addresses } from '../entities/addresses.entity';
import { Banner } from '../entities/banners.entity';
// Create and export the TypeORM data source for MySQL
export const AppDataSource = new DataSource({
  type: "mysql",
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.dbName,
  entities: [User, Token, Addresses, Banner]
});