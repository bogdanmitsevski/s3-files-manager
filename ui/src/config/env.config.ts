import Joi from 'joi';

const envSchema = Joi.object({
  VITE_API_URL: Joi.string()
    .uri()
    .required()
    .description('Base URL for the API server'),
}).unknown(true);

const validateEnv = () => {
  const { error, value } = envSchema.validate(import.meta.env, {
    abortEarly: false,
    stripUnknown: false,
  });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message).join(', ');
    throw new Error(`Environment validation error: ${errorMessages}`);
  }

  return value;
};

const validatedEnv = validateEnv();

export const config = {
  api: {
    baseUrl: validatedEnv.VITE_API_URL as string,
  },
} as const;

export type AppConfig = typeof config;

