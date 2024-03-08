import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { User } from "../model/userModel";
export const protectedRoutes = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.headers["authorization"];
  if (accessToken) {
    const token = accessToken.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_KEY!, async (err, decode) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden" });
      } else {
        const jwtPayload = decode as JwtPayload;
        req.user = await User.findById(jwtPayload.id).select("-password");
        next();
      }
    });
  } else {
    req.user = null;
    next();
  }
};
