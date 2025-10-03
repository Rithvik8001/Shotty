// Vercel serverless function entry point
import type { VercelRequest, VercelResponse } from "@vercel/node";
import app from "../src/app.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Let Express handle the request
  return app(req, res);
}
