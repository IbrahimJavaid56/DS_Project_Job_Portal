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
        firstName: Joi.string().trim().max(50).required().regex(/^[a-zA-Z][a-zA-Z0-9 ]*$/).message('First Name must be valid'),
        lastName: Joi.string().trim().max(50).required().regex(/^[a-zA-Z][a-zA-Z0-9 ]*$/).message('Last Name must be valid'),
        email: Joi.string().required().email().regex(/^[a-zA-Z0-9._%+-]+@(gmail|hotmail|outlook)\.[a-zA-Z]{2,}$/).message('Invalid email'),
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

