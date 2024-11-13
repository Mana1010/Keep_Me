import jwt from "jsonwebtoken";
import "dotenv/config";
export function createRefreshToken(id: string) {
  return jwt.sign({ id }, process.env.REFRESH_TOKEN!, {
    expiresIn: "1d",
  });
}
export function createAccessToken(id: string) {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN!, {
    expiresIn: "15m",
  });
}
