import Joi from 'joi';
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/connect_Db.js';
const ApiLogs = sequelize.define('ApiLog', {
    logId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    accept: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userAgent: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    connection: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    acceptEncoding: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    requestUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    requestMethod: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    requestBody: {
      type: DataTypes.TEXT,
    },
    statusCode: {
      type: DataTypes.INTEGER,
    },
  }, {
    timestamps: true,
  });
// Joi validation schema for ApiLog attributes
// const apiLogJoiSchema = Joi.object({
//     accept: Joi.string().required(),
//     userAgent: Joi.string().required(),
//     connection: Joi.string().required(),
//     acceptEncoding: Joi.string().required(),
//     requestUrl: Joi.string().required(),
//     requestMethod: Joi.string().required(),
//     requestBody: Joi.string().allow(null), 
//     statusCode: Joi.number().integer().allow(null), // Allow null if statusCode is optional
//   });
// // Function to validate ApiLog data using Joi schema
// const validateApiLog = (apiLog) => apiLogJoiSchema.validate(apiLog);
export { ApiLogs };