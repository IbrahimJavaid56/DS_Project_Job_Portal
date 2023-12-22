import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';
import util from 'util';
import dotenv from 'dotenv';
dotenv.config();
const authorizeUser = async (req, res, next) => {
    const token = req.headers.authorization;
    let tokenValue;
  
    if (token && token.startsWith('Bearer')) {
      tokenValue = token.split(' ')[1];
    }
    //console.log('Token:', tokenValue);
    if (!tokenValue) {
      return sendResponse(res, 400, 'Sorry, you are not logged in', false);
    }
    try {
      const decodeToken = await util.promisify(jwt.verify)(tokenValue, process.env.SECRECT_KEY);
      console.log('Decoded Token:', decodeToken);
      if (!decodeToken.existingUserToSign) {
        return sendResponse(res, 400, 'Invalid token format', false);
      }
  
      const loginUser = await User.findOne({
        where: { email: decodeToken.existingUserToSign.email },
      });
      //console.log('Login User:', loginUser);
  
      if (!loginUser) {
        return sendResponse(res, 400, 'Sorry, you are not logged in', false);
      }
      console.log(loginUser.isVerified);
      if (!loginUser.isVerified) {
        return sendResponse(res, 401, 'User is not verified', false);
      }
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        // Handle expired token error
        return sendResponse(res, 401, 'Token has expired', false);
      } else {
        // Handle other JWT verification errors
        return sendResponse(res, 400, error.message, false);
      }
    }
    next();
  };
  
  const sendResponse = (res, statusCode, data, success) => {
    return res.status(statusCode).json({ statusCode,success,data });
};  

export {authorizeUser};
