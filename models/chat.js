import {DataTypes} from 'sequelize';
import { sequelize } from '../config/connect_Db.js';
// Define the Chat model
const Chat = sequelize.define('Chat', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  question: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gptResponse: {
    type: DataTypes.STRING, 
    allowNull: false,
  },
});

// Synchronize the model with the database
Chat.sync();

export {Chat};
