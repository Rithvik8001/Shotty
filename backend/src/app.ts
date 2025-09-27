import express, { type Express } from "express";
import connectDB from "./db/config/db.ts";
import dotenv from "dotenv";
dotenv.config();
import userRoute from "./routes/user/route.ts";
import cors from "cors";
const app: Express = express();
import cookieParser from "cookie-parser";
import type { Request, Response, NextFunction } from "express";
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(
  cors({
    origin: `${process.env.CLIENT_URL}`,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", `${process.env.CLIENT_URL}`);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// routes
app.use(userRoute);

connectDB()
  .then(() => {
    console.log("Connected to Database");
  })
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error connecting to Database");
    console.log(err);
  });
