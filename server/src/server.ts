import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import authRoute from "./routes/authRoute";
import userRoute from "./routes/userRoute";
import errorHandler from "./middleware/errorHandler";
import { loggers } from "winston";
import winston from "winston";
const app = express();

const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(
  cors({
    // origin: "https://keep-me-webapp.vercel.app",
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use(errorHandler);

async function getDb() {
  try {
    await mongoose.connect(
      // ["mongodb+srv://tristanvicclarito2003:WX3aVuUZ2ELqci1m@cluster0.dkbqliv.mongodb.net/"]
      process.env.MONGO_URI!
    );
    console.log("Database connected successfully!!!");
  } catch (err) {
    console.log(err);
  }
}
getDb();
app.listen(PORT, () => {
  console.log("Server is listening!!");
});
