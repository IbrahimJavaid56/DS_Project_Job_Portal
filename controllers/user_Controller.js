import { User, validateUser } from "../models/user.js";
import bcrypt from "bcryptjs";
import { emailQueue } from "../utils/emailQueue.js";
import jwt from "jsonwebtoken";
import Joi from "joi";
import { handleSuccess, handleFailure } from "../utils/helper_function.js";
import _ from "lodash";
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
      return res
        .status(400)
        .json({ message: "Validation error", error: error.details[0].message });
    }
    const { password } = req.body;
    const { token } = req.params;
    console.log('insideSetpassword');
    // Find user by rememberToken
    const user = await User.findOne({
      where: {
        rememberToken:token,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "Invalid token" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user's password and set isVerified to true
    await user.update({
      password: hashedPassword,
      isVerified: true,
      rememberToken:null
    });

    return res.status(200).json({ message: "Password set successfully" });
  } catch (error) {
    console.error("Error setting password:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const createUser = async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) {
    return res.status(400).send({ message: "User data not validated", error });
  }
  const existingUser = await User.findOne({
    where: {
      email: req.body.email,
    },
  });

  if (existingUser) {
    handleFailure(
      res,
      409,
      `User Already Exists With This Email:${req.body.email}`
    );
  } else {
    const verificationToken = generateVerificationToken();
    let newUser = User.create({
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
      "Registration successful. Check your email for verification."
    );
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
  console.log(email,password);
  try {
      const existingUser = await User.findOne({ where: { email } });
      console.log(existingUser);
      if (!existingUser) {
          return res.status(400).json({ message: "User Not Found" });
      }
      const passHash = existingUser.dataValues.password;
      const comparePassword = hashPass(password,passHash);
      if (!comparePassword) {
          return res.status(400).json({ message: "Password Did Not Match" });
      }
      // Adjust payload for the token
      const payload = { email: existingUser.email, id: existingUser.userId };
      // Generate JWT token
      const token = jwt.sign(payload,process.env.SECRECT_KEY);
      res.status(200).json({ user: _.pick(existingUser, ['email']), token: token, message: "Login Successfully" });
  } catch (error) {
      console.error("Signin error:", error);
      res.status(500).json({ message: "Internal Server Error" });
  }
};

// const logIn1 = async (req, res) => {
//   const { email, password } = req.body;
//   console.log(email);
//   console.log(password);
//   const foundUser=User.findOne({where:{email: email}});
//   const comparePassword = await bcrypt.compare(password,foundUser.password);

//   const token = jwt.sign(
//     { email: foundUser.email, id: foundUser._id },
//     "mysecretekey"
//   );
//   res.status(200).json({ user: foundUser, token: token });
// };
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

export { createUser, verifyUser, logIn, setPassword };

