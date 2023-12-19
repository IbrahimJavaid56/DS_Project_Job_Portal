import express from 'express';
import { createUser, logIn,setPassword,verifyUser,forgetPassword } from '../controllers/user_Controller.js';
import { authenticateAdminMiddleware } from '../middlewares/auth_Middlewear.js';
const userRouter = express.Router();

userRouter.post('/user/createUser',authenticateAdminMiddleware,createUser);
userRouter.post('/user/logIn',logIn);
userRouter.get('/verify/:token', verifyUser);
userRouter.post('/user/setPassword/:token',setPassword)
userRouter.post('/user/forgetPassword', forgetPassword);

export default userRouter;