import { Mongoose, Types } from "mongoose";
interface User {
  email?: string;
  username?: string;
  _id?: Types.ObjectId;
}
declare global {
  namespace Express {
    interface Request {
      user: User | null;
    }
  }
}

export {};
