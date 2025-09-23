import express, { type Express } from "express";
import connectDB from "./db/config/db.ts";
import dotenv from "dotenv";
dotenv.config();
import userRoute from "./routes/user/route.ts";
const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
