import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async () => {
  try {
    const { MONGO_URI } = ENV;
    if (!MONGO_URI) throw new Error("MONGO_URI belum di set up!");

    const conn = await mongoose.connect(ENV.MONGO_URI);
    console.log("MongoDB telah terkoneksi:", conn.connection.host);
  } catch (error) {
    console.log("MongoDB gamao terkoneksi:", error);
    process.exit(1);
  }
};
