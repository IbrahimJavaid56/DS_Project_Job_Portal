//Database connection
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();
const sequelize = new Sequelize(process.env.DB_NAME,process.env.DB_USER, '', {
  dialect: 'mysql',
  logging: false,
});

export {sequelize};
