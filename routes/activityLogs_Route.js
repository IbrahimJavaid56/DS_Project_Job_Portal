import express from 'express';
import { logUserActivity } from '../middlewares/activity_logs.js';
import { getAllLogs } from '../controllers/activity_Logs_Controller.js';
const activityLogs = express.Router()

activityLogs.get('/log/get-logs',logUserActivity,getAllLogs);
export default activityLogs;