import mongoose from "mongoose";
let cached = global.mongoose || { conn: null, promise: null };

export async function connectDB() {

  if (cached.conn) return cached.conn;

  if (!process.env.MONGODB_URI)
    throw new Error("Add MONGODB_URI to .env.local");

  cached.promise = mongoose.connect(process.env.MONGODB_URI);

  cached.conn = await cached.promise;

  global.mongoose = cached;

  return cached.conn;
}