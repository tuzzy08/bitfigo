import { config } from 'dotenv';

config();

export const jwtConstants = {
  key: process.env.JWT_SECRET,
};
