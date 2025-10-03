import express, { type Express } from "express";
import connectDB from "./db/config/db.ts";
import dotenv from "dotenv";
dotenv.config();
import userRoute from "./routes/user/route.ts";
import urlRoute from "./routes/url/route.ts";
import { redirectUrl } from "./controllers/createUrl.ts";
import cors from "cors";
const app: Express = express();
import cookieParser from "cookie-parser";
import type { Request, Response, NextFunction } from "express";
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: `${process.env.CLIENT_URL}`,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use((_req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", `${process.env.CLIENT_URL}`);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// routes
app.use(userRoute);
app.use(urlRoute);

app.get("/:shortUrl", redirectUrl);

// Connect to DB
connectDB()
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((err) => {
    console.log("Error connecting to Database");
    console.log(err);
  });

// Only start server if not in Vercel (serverless)
if (process.env.VERCEL !== "1") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
