import { Sequelize } from 'sequelize';
import { config } from '../config/config';
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: config.host,
  username: config.username,
  password: config.password,
  database: config.database,
  logging: false, // Disable logging for production
});

export default sequelize;
