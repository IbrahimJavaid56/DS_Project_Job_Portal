import express from 'express';
import { createUser, logIn,setPassword,verifyUser } from '../controllers/user_Controller.js';

const userRouter = express.Router();

userRouter.post('/user',createUser);
userRouter.post('/user/logIn',logIn);
userRouter.get('/verify/:token', verifyUser);
userRouter.post('/user/setPassword',setPassword)

export default userRouter;