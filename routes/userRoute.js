import express from 'express';
import { createUser, logIn,setPassword,verifyUser,forgetPassword,getUsers } from '../controllers/user_Controller.js';
//import {requiredAuth } from '../middlewares/auth_Middlewear.js';
import { authorizeUser } from '../middlewares/middlewear.js';
import { logUserActivity } from '../middlewares/activity_logs.js';
//import { ApiLogs } from '../models/api_Logs.js';
const userRouter = express.Router();

userRouter.post('/user/createUser',authorizeUser,createUser);
userRouter.post('/user/logIn',logUserActivity, logIn);
userRouter.get('/verify/:token', verifyUser);
userRouter.post('/user/setPassword/:token',setPassword)
userRouter.post('/user/forgetPassword/',forgetPassword);
userRouter.get('/user/getUsers', getUsers);
export default userRouter;