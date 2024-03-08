import { Request, Response } from "express";
import { User } from "../model/userModel";
import { createAccessToken, createRefreshToken } from "../utils/token";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
export const getSignUp = asyncHandler(async (req: Request, res: Response) => {
  const { email, username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 16);
    await User.create({ email, username, password: hashedPassword });
    res.status(201).json({ message: "Successfully Sign Up" });
  } catch (err: any) {
    res.status(400).json({
      message:
        err.code === 11000
          ? "Oops! Email address already used"
          : "Oops! Something went wrong while signing up. Please try again later.",
    });
  }
});
export const getLogIn = asyncHandler(async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const findUser = await User.findOne({ username });
  if (!findUser) {
    res.status(401);
    throw new Error("Opps, Wrong Credentials");
  }
  const passwordCompare = await bcrypt.compare(
    password,
    findUser?.password as string
  );
  if (!findUser || !passwordCompare) {
    res.status(401);
    throw new Error("Opps, Wrong Credentials");
  }
  const accessToken = createAccessToken(findUser?._id.toString() as string);
  const refreshToken = createRefreshToken(findUser?._id.toString() as string);
  res
    .status(200)
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 1000,
      sameSite: "none",
      secure: true,
    })
    .json({
      message: "Successfully Log In",
      token: accessToken,
    });
});
export const changePassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { password, newpassword } = req.body;

    if (!req.user) {
      res.status(401);
      throw new Error("User not authorized, please log in first");
    }
    const findUser = await User.findById(req.user._id);
    if (!findUser) {
      res.status(401);
      throw new Error("User not authorized, please log in first");
    }
    const passwordCompare = await bcrypt.compare(password, findUser.password);
    if (!passwordCompare) {
      res.status(400);
      throw new Error("Invalid current password, please try again");
    }
    findUser.password = await bcrypt.hash(newpassword, 16);
    await findUser.save();
    res.status(200).json({ message: "Password successfully change" });
  }
);
export const verifyAccount = (req: Request, res: Response) => {
  if (req.user) {
    res.status(200).json({ message: req.user });
  } else {
    res.status(400).json({ message: "Error" });
  }
};
export const newAccessToken = asyncHandler(
  async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      res.status(401);
      throw new Error("Unauthorized");
    }
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_KEY!,
      (err: Error | null, decoded: any) => {
        if (err) {
          res.status(403);
          throw new Error("Forbidden");
        } else {
          const token = createAccessToken(decoded.id.toString());
          res.status(200).json({ token });
        }
      }
    );
  }
);

export const logOut = asyncHandler(async (req: Request, res: Response) => {
  const cookie = req.cookies?.refreshToken;
  if (!cookie) {
    res.status(403);
    throw new Error("Forbidden");
  }
  res
    .status(200)
    .clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    })
    .json({ message: "Log out Successfully" });
});
export const getUserDetails = asyncHandler(
  async (req: Request, res: Response) => {
    const getUser = await User.findById(req.user?._id)
      .select(["username", "email"])
      .lean();
    if (!getUser) {
      res.status(401);
      throw new Error("User not authorized");
    }
    res.status(200).json({ message: getUser });
  }
);
