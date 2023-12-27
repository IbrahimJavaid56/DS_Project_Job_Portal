import express from 'express';
import { createUser, logIn,setPassword,forgetPassword,getUsers, changePassword } from '../controllers/user_Controller.js';
import { authorizeUser,checkForAdmin } from '../middlewares/middlewear.js';
import { logUserActivity } from '../middlewares/activity_logs.js';
const userRouter = express.Router();

userRouter.post('/create-user',logUserActivity,authorizeUser,checkForAdmin,createUser);
userRouter.post('/login',logUserActivity, logIn);
userRouter.post('/set-password/:token',logUserActivity,setPassword)
userRouter.post('/forget-password',logUserActivity,forgetPassword);
userRouter.post('/change-password/',logUserActivity,changePassword);
userRouter.get('/user/get-user', getUsers);
export default userRouter;