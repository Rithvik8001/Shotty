import mongoose from "mongoose";
import { Schema, type Document, type ObjectId } from "mongoose";

interface UrlInterface extends Document {
  originalUrl: string;
  shortUrl: string;
  userId: ObjectId;
  clicks: number;
}

const url = new Schema<UrlInterface>(
  {
    originalUrl: {
      type: String,
      required: true,
    },
    shortUrl: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    clicks: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Url = mongoose.model<UrlInterface>("Url", url);
export default Url;
