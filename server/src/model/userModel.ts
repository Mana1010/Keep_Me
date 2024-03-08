import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: function (password: string) {
          return password.length > 8;
        },
        message: "Password must be greater than 8 characters long.",
      },
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("users", userSchema);
