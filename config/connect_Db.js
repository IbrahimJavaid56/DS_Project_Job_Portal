//Database connection
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();
const sequelize = new Sequelize('Database_UMS','root', '', {
  // host: 'localhost',
  dialect: 'mysql',
  logging: false,
});

export {sequelize};
