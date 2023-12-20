import jwt from "jsonwebtoken";
import {User} from "../models/user.js";
import dotenv from "dotenv";
dotenv.config();

// const authenticateMiddleware = async (req, res, next) => {
//     const token = req.headers.token;
//     if (!token) {
//       return res.status(401).json({ error: "Unauthorized" });
//     }
//     try {
//       // Verify the token using your secret key
//       const decoded = jwt.verify(token, process.env.SECRECT_KEY);
//       const user = await User.findOne({
//         where: { email: decoded.email },
//       });
//       // console.log(user);
//       if (!user) {
//         return res.status(401).json({ error: "Unauthorized - User not found" });
//       }
//       req.user = user;
//       next();
//     } catch (error) {
//       return res.status(401).json({ error: "Unauthorized - Invalid token" });
//     }
//   };
const authenticateMiddleware = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "Unauthorized - Token missing or invalid" });
  }

  const token = authorizationHeader.split(' ')[1];

  try {
      // Verify the token using your secret key
      const decoded = jwt.verify(token, process.env.SECRECT_KEY);
      // const user = await User.findOne({
      //     where: { email: decoded.email },
      // });
      const user = await User.findOne({
        where: { userId: decodeToken.userId },
    });
      if (!user) {
          return res.status(401).json({ error: "Unauthorized - User not found" });
      }

      req.user = user;
      next();
  } catch (error) {
      return res.status(401).json({ error: "Unauthorized - Invalid token" });
  }
};

const requiredAuth = async (req, res, next) => {
    try {
      // Get the token from the Authorization header
      const token = req.headers.authorization;
      if (token) {
        // Verify the token
        const decodedToken = jwt.verify(token, process.env.SECRECT_KEY);
        // Check if the user exists and is an admin
        const existingUser = await User.findOne({
          where: {
            id: decodedToken.userId,
            isAdmin: true,
          },
        });
        if (existingUser) {
          next();
        } else {
          sendApiError(res, "Authenticated user is not an admin", 401);
        }
      } else {
        sendApiError(res, "Authentication token not provided. Redirecting to login.", 401);
      }
    } catch (error) {
      console.log(error.message);
      sendApiError(res, "Authentication failed. Redirecting to login.", 401);
    }
  };
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
export {authenticateMiddleware,requiredAuth};