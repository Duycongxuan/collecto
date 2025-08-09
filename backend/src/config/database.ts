import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { config } from './env';
import { User } from '@/entities/users.entity';
import { Token } from '@/entities/tokens.entity';
import { Addresses } from '@/entities/addresses.entity';
import { Banner } from '@/entities/banners.entity';
import { Category } from '@/entities/categories.entity';
import { Brand } from '@/entities/brands.entity';
import { Product } from '@/entities/products.entity';
import { ProductImage } from '@/entities/productImage';

const dataSourceOptions: DataSourceOptions & SeederOptions = {
  type: "mysql",
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.dbName,
  entities: [User, Token, Addresses, Banner, Category, Brand, Product, ProductImage],
  seeds: ['src/seeders/**/*.ts'],
  factories: ['src/factories/**/*.ts'], // if you have factories
  synchronize: true,
  logging: false,
};

export const AppDataSource = new DataSource(dataSourceOptions);