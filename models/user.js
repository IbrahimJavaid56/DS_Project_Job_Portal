import {BOOLEAN, DataTypes} from 'sequelize';
import { sequelize } from '../config/connect_Db.js';
import Joi from 'joi';
const User = sequelize.define('User', {
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement:true
  },
  firstName: {
    type: DataTypes.STRING(50),
    minLength:1,
    maxLength:30,
    allowNull:false
  },
  lastName: {
    type: DataTypes.STRING(50),
    minLength:1,
    maxLength:30,
    allowNull:false
  },
  email: {
    type: DataTypes.STRING(50),
    unique:true,
    allowNull:false
  },
  password: {
    type: DataTypes.STRING(100)
  },
  rememberToken: {
    type: DataTypes.STRING(50)
  },
  isAdmin: {
    type: BOOLEAN,
    default : false,
    required: false
  },
  isVerified: {
    type: BOOLEAN,
    default : false,
    required: false
  },
}, {
  timestamps: true
}, {
  tableName: 'users',
});

function validateUser(user){
    const schema =Joi.object({
        firstName: Joi.string().min(1).max(30).required(),
        lastName: Joi.string().min(1).max(30).required(),
        email: Joi.string().required().email(),
        password: Joi.string(),
        rememberToken: Joi.string(),
        isAdmin: Joi.boolean(),
        isVerified: Joi.boolean()
    });
    return schema.validate(user);
    }
async function syncModels() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    await sequelize.sync();// Sync models
    console.log('Models synchronized with the database.');
  } catch (error) {
    console.error('Error syncing models with the database:', error);
  }
}


export {User,syncModels,validateUser}

