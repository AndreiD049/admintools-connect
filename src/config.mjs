import dotenv from 'dotenv';

dotenv.config();

export default {
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
};
