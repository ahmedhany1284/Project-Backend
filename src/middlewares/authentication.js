import Token from "../../DB/models/token.model.js";
import User from "../../DB/models/user.model.js";
import { asyncHandler } from "./../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const authentication = asyncHandler(async (req, res, next) => {
  let { token } = req.headers;
  if (!token) {
    return next(new Error("Token is missing!", { cause: 400 }));
  }

  if (!token.startsWith(process.env.BEARER_KEY))
    return next(new Error("Invalid Token", { cause: 400 }));
  token = token.split(process.env.BEARER_KEY)[1];

  const validToken = await Token.findOne({ token, isValid: true });
  if (!validToken) return next(new Error("Token expired", { cause: 400 }));

  const payload = jwt.verify(token, process.env.TOKEN_KEY);
  // Find the user by ID
  const user = await User.findById(payload.id);
  // Check if the user exists
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }
  req.user = user;
  req.payload = payload;
  return next();
});
