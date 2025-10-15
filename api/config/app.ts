import { attemptEnv } from '../core/env';
import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

const getAppConfig = () => {
  const host: string = attemptEnv('NEST_HOST', Joi.string().required());
  const port: string = attemptEnv('NEST_PORT', Joi.number().required());

  const awsAccessKeyId: string = attemptEnv(
    'AWS_ACCESS_KEY_ID',
    Joi.string().required(),
  );
  const awsSecretAccessKey: string = attemptEnv(
    'AWS_SECRET_ACCESS_KEY',
    Joi.string().required(),
  );
  const awsRegion: string = attemptEnv('AWS_REGION', Joi.string().required());
  const awsBucket: string = attemptEnv('AWS_BUCKET', Joi.string().required());
  return {
    port,
    host,
    awsAccessKeyId,
    awsSecretAccessKey,
    awsRegion,
    awsBucket,

    docs: {
      enabled: true,
      prefix: 'docs',
    },
  };
};

export const appConfig = getAppConfig();

export type AppConfig = typeof appConfig;

export const appConfigFactory = registerAs('app', () => appConfig);
