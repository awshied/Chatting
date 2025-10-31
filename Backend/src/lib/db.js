import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const { MONGO_URI } = process.env;
    if (!MONGO_URI) throw new Error("MONGO_URI belum di set up!");

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB telah terkoneksi:", conn.connection.host);
  } catch (error) {
    console.log("MongoDB gamao terkoneksi:", error);
    process.exit(1);
  }
};
