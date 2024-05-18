import User from "../../../DB/models/user.model.js";
import Token from "../../../DB/models/token.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validateEmail, validatePassword } from "../../utils/validators.js";

// 1-signUp
export const signUp = async (req, res, next) => {
  let { username, gender, email, level, password, confirmPassword } = req.body;

  // Check if the email is valid
  if (!validateEmail(email)) {
    return next(new Error("Invalid email address", { cause: 400 }));
  }

  // Check if the password is valid
  if (!validatePassword(password)) {
    return next(
      new Error("Password must be at least 8 characters", { cause: 400 })
    );
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    return next(new Error("Passwords do not match", { cause: 400 }));
  }

  // Check if the user already exists
  const isExist = await User.findOne({ email });
  if (isExist) {
    return next(new Error("User already exists", { cause: 400 }));
  }
  // hashing pass
  password = bcrypt.hashSync(password, parseInt(process.env.SALT_ROUND));
  // Create a new user
  const user = await User.create({
    username,
    gender,
    email,
    level,
    password,
  });

  return res.status(201).json({ success: true, results: user });
};
// 2-login-->with create token
export const login = async (req, res, next) => {
  const { email, password } = req.body;
  // Find user email
  const user = await User.findOne({ email });
  // Check if the user exists
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }
  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    return next(new Error("Incorrect password", { cause: 400 }));
  }
  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.TOKEN_KEY,
    { expiresIn: "1d" }
  );

  let currentDate = new Date();
  let expirationTime = currentDate.getTime() + 1 * 60 * 60 * 24 * 1000; // 1 day
  await Token.create({
    token,
    userID: user._id,
    agent: req.headers["user-agent"],
    expiredAt: new Date(expirationTime),
  });

  return res.json({
    success: true,
    message: "user sign in successfully",
    token,
  });
};
