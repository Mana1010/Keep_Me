import { Request, Response, NextFunction } from "express";
import "dotenv/config";
const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = res.statusCode || 500;
  res.status(statusCode).json({
    message: err.message,
    stack: null,
    statusCode: res.statusCode,
  });
  console.log("running");
};

export default errorHandler;
