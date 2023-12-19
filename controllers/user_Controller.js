import { User, validateUser } from "../models/user.js";
import {sendApiError,sendApiResponse} from '../utils/responseFormat.js';
import bcrypt from "bcryptjs";
import { emailQueue } from "../utils/emailQueue.js";
import { forgetPassQueue } from "../utils/forgetPasswordQueue.js";
import jwt from "jsonwebtoken";
import Joi from "joi";
import { handleSuccess, handleFailure } from "../utils/helper_function.js";
import _ from "lodash";
import { Op } from 'sequelize';
import util from 'util';
import dotenv from "dotenv";
dotenv.config();

// Validation schema for password and confirm password
const setPasswordSchema = Joi.object({
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
});

const setPassword = async (req, res) => {
  try {
    // Validate the password and confirm password
    const { error } = setPasswordSchema.validate(req.body);
    if (error) {
      throw new Error(`Validation error: ${error.details[0].message}`);
    }
    const { password } = req.body;
    const { token } = req.params;
    const user = await User.findOne({
      where: {
        rememberToken: token,
      },
    });
    if (!user) {
      throw new Error("Invalid token");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    // Update user's password and set isVerified to true
    await user.update({
      password: hashedPassword,
      isVerified: true,
      rememberToken: null,
    });

    handleSuccess(res, 200, [], "Password set successfully");
  } catch (error) {
    handleFailure(res, 500,error.message);
  }
};

const createUser = async (req, res) => {
  try {
    const { error } = validateUser(req.body);
    if (error) {
      throw new Error(`Validation error: ${error.message}`);
    }
    const existingUser = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (existingUser) {
      throw new Error(`User Already Exists With This Email: ${req.body.email}`);
    }

    const verificationToken = generateVerificationToken();
    let newUser = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      rememberToken: verificationToken,
    });

    const email = req.body.email;
    emailQueue.add("emailVerification", { email, verificationToken });

    handleSuccess(
      res,
      200,
      newUser,
      "Registration successful. Check your email for verification."
    );
  } catch (error) {
    handleFailure(res, 400, error.message);
  }
};

//VERIFICATION ENDPOINT
const verifyUser = async (req, res) => {
  const { token } = req.params;
  console.log(token);
  try {
    // Find the user by the verification token
    const user = await User.findOne({
      where: {
        rememberToken: token,
      },
    });
    if (!user) {
      handleFailure(res, 400, "Invalid verification token");
      //return res.status(404).json({ message: 'Invalid verification token' });
    }
    const affectedRows = await User.update(
      { rememberToken: null },
      {
        where: {
          email: user.email,
        },
      }
    );
    // Respond with a success message
    //res.json({ message: 'Email verification successful!' });
    handleSuccess(res, 200, "Email verification successful!");
  } catch (error) {
    console.error(error);
    //res.status(500).json({ error: 'Failed to verify email' });
    handleFailure(res, 500, "Failed to verify email");
  }
};

async function hashPass(password,passHash){  
    const result = await bcrypt.compare(password,passHash);
    return result; 
}
//LOGIN ENDPOINT
const logIn = async (req, res) => {
  const { email, password } = req.body;
  console.log(email,password)
  try {
    const existingUser = await User.findOne({
      where: {
        email: email,
      },
    });
    if (!existingUser) {
      return sendApiError(res, "Email or Password is Incorrect", 400);
    }
    // Compare the provided password with the hashed password in the database
    const passwordMatch = hashPass(password, existingUser.password);
    if (!passwordMatch) {
      return sendApiError(res, "Email or Password is Incorrect", 400);
    }
    // Generate a JWT token
    const token = jwt.sign({ userId: existingUser.id,isAdmin:existingUser.isAdmin }, process.env.SECRECT_KEY, { expiresIn: '1h' });
    sendApiResponse(res, { existingUser,token }, "Login successfully");
  } catch (error) {
    sendApiError(res, error, 500, "Custom error message");
  }
};

const forgetPassword = async (req, res) => {
  try {
      const { email } = req.body;

      // Find user by email
      const user = await User.findOne({ where: { email } });

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Set the reset token and expiry time for password reset
      const expiryTime = new Date(Date.now() + 60 * 1000); // Set expiry to 24 hours from now
      user.rememberTokenExpiry = expiryTime;
      if (user.isRememberTokenExpired()) {
          return FailedApi(res, 400, { message: "Token has expired" });
      }
      await user.save();

      // Send email with the reset link to the user
      await forgetPassQueue.add('sendPasswordResetEmail', { user: user });

      return res.status(200).json({ message: 'Password reset link sent successfully' });
  }catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ message: 'Internal server error'});
  }
};

//FUNCTION TO GENERATE REMEMBERTOKEN.
function generateVerificationToken() {
  const charactersToGenerateRandomToken =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let token = "";
  for (let startIndex = 0; startIndex < 12; startIndex++) {
    const randomIndex = Math.floor(
      Math.random() * charactersToGenerateRandomToken.length
    );
    token = token + charactersToGenerateRandomToken.charAt(randomIndex);
  }
  return token;
}
//FUNCTION TO GET USER
const userProfile = async(req , res)=>{
  const {userId} = req.params;
  try {

  if (!userId) {
    return res.status(400).json({ message: 'Sorry, User Does Not Exist' });
  }

  const user = await User.findOne({
    attributes:['userId','firstName','lastName','email','isAdmin','isVerified'],
    where: {
      userId,
    },
  });

  if (!user) {
    return res.status(404).json({ message: 'Sorry, User Not Found' });
  }

  return res.status(200).json({
    success: true,
    data: user,
  });
} catch (error) {
  console.error('Error in getProfile:', error);
  return res.status(500).json({ message: 'Internal Server Error' });
}
}

export { createUser, verifyUser, logIn, setPassword,forgetPassword };

