import { attemptEnv } from '../core/env';
import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Media } from 'entities/media.entity';

const getDatabaseConfig = (): TypeOrmModuleOptions => {
  const host: string = attemptEnv('DB_HOST', Joi.string().required());
  const port: number = attemptEnv('DB_PORT', Joi.number().required());
  const username: string = attemptEnv('DB_USERNAME', Joi.string().required());
  const password: string = attemptEnv('DB_PASSWORD', Joi.string().allow(''));
  const database: string = attemptEnv('DB_DATABASE', Joi.string().required());
  const synchronize: boolean = attemptEnv(
    'DB_SYNCHRONIZE',
    Joi.boolean().required(),
  );
  const logging: boolean = attemptEnv('DB_LOGGING', Joi.boolean().required());

  return {
    type: 'postgres',
    host,
    port,
    username,
    password,
    database,
    entities: [Media],
    synchronize,
    logging,
    migrationsRun: false,
  };
};

export const databaseConfig = getDatabaseConfig();

export type DatabaseConfig = typeof databaseConfig;

export const databaseConfigFactory = registerAs(
  'database',
  () => databaseConfig,
);
