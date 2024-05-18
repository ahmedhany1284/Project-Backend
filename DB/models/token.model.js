import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isValid: {
      type: String,
      default: true,
    },
    agent: String,
    expiredAt: Date,
  },
  { timestamps: true }
);

const Token = mongoose.model("Token", tokenSchema);

export default Token;
