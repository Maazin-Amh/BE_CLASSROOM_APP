import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env sebelum config digunakan
dotenv.config({
  path: path.resolve(process.cwd(), '.env'),
});

console.log('=== DATABASE CONFIG ===');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_USERNAME:', process.env.DB_USERNAME);
console.log('DB_DATABASE:', process.env.DB_DATABASE);
console.log('=======================');

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',

  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),

  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,

  entities: [__dirname + '/../**/*.entity{.ts,.js}'],

  synchronize: false,
  logging: true,
};
