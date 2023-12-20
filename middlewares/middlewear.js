import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';
import util from 'util';
import dotenv from 'dotenv';
dotenv.config();
const authorizeUser = async(req,res,next)=>{
    const token = req.headers.authorization
    let tokenValue;
    if(token && token.startsWith('Bearer')){
        tokenValue = token.split(' ')[1]
    }
    console.log(tokenValue);
    if(!token){
        return sendResponse(res, 400, 'Sorry You are not Login', false);
    }
    try{
        const decodeToken = await util.promisify(jwt.verify)(tokenValue, process.env.SECRECT_KEY)
        console.log(decodeToken
            )
        const loginUser = await User.findOne({
            where: { email: decodeToken.email },
             });

        console.log(loginUser)
       if(!loginUser){
        return sendResponse(res, 400, 'Sorry You are not Login', false);
       }
       //4-Check if user changed password after token is issued PENDING
       req.user = loginUser
    }catch(error){
        return sendResponse(res, 400, error.message, false);
    }
    next()
};
const checkrole = () => {
    return (req, res, next) => {
        if (req.user.isAdmin === false) {
            return sendResponse(res, 403, 'Sorry, you are not authorized', false);
        }
        next();
    };
};
const sendResponse = (res, statusCode, data, success) => {
    return res.status(statusCode).json({ success, data });
};

export {authorizeUser};