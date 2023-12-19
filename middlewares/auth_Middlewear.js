import jwt from "jsonwebtoken";
import {User} from "../models/user.js";
import dotenv from "dotenv";
dotenv.config();

const authenticateMiddleware = async (req, res, next) => {
    const token = req.headers.token;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      // Verify the token using your secret key
      const decoded = jwt.verify(token, process.env.SECRECT_KEY);
      const user = await User.findOne({
        where: { email: decoded.email },
      });
      // console.log(user);
      if (!user) {
        return res.status(401).json({ error: "Unauthorized - User not found" });
      }
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ error: "Unauthorized - Invalid token" });
    }
  };
  
  // function isAdminMiddleware(req, res, next) {
  //   try {
  //     const header = req.headers.authorization;
  //     if (!header) return res.status(401).send('Token not available');
  //     const token = header.split(' ')[1];
  //     const user = jwt.decode(token);
  //     if (user.isAdmin) {
  //       jwt.verify(token, process.env.SECRECT_KEY, (error, decoded) => {
  //         if (error) {
  //           console.error('JWT verification failed:', error.message);
  //           return res.status(401).json({ error: "Unauthorized - Invalid token" });
  //         } else {
  //           next();
  //         }
  //       });
  //     } else {
  //         return res.status(403).json({ error: "Unauthorized - Invalid token" });
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).send('Internal Server Error');
  //   }
  // }

  const  authenticateAdminMiddleware = async (req, res, next) => {
    const token = req.headers.authorization;
    //console.log(token)
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      // Verify the token using your secret key
      const decoded = jwt.verify(token,SECRECT_KEY);
      const user = await User.findOne({ email: decoded.email });
      //console.log(user);
      // Check if the user has isAdmin property set to true
      if (user.isAdmin !== true) {
        return res
          .status(403)
          .json({ error: "DONOT HAVE PERMISSION TO CREATE TASK" });
      }
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ error: "Unauthorized - Invalid token" });
    }
  };
export {authenticateMiddleware,authenticateAdminMiddleware};