import mongoose from "mongoose";
import { Schema } from "mongoose";

const user = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", user);
export default User;
