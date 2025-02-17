import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};