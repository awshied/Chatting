import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ENV } from "../lib/env.js";

export const socketAuthMiddleware = async (socket, next) => {
  try {
    const token = socket.handshake.headers.cookie
      ?.split("; ")
      .find((row) => row.startsWith("jwt="))
      ?.split("=")[1];

    if (!token) {
      console.log("Koneksi Socket Ditolak: Gada Tokennya");
      return next(new Error("Gada izin - Token ga tersedia, maaf yaa :("));
    }

    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    if (!decoded) {
      console.log("Koneksi Socket Ditolak: Tokennya ga valid");
      return next(new Error("Gada izin - Tokennya ga valid, maaf ya :("));
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      console.log("Koneksi Socket Ditolak: Usernya ga ada");
      return next(new Error("Yaaahh, penggunanya gada!"));
    }

    socket.user = user;
    socket.userId = user._id.toString();

    console.log(
      `Autentikasi socket untuk pengguna: ${user.fullName} (${user._id})`
    );

    next();
  } catch (error) {
    console.error("Terjadi kesalahan pada autentikasi socket:", error.message);
    next(new Error("Autentikasinya gagal ges"));
  }
};
