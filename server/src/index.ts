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

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(
  cors({
    origin: "https://keep-me-webapp.vercel.app",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use(errorHandler);
async function getDb() {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    app.listen(PORT, () => {
      console.log("Server is listening!!!");
    });
  } catch {
    process.exit(1);
  }
}
getDb();
