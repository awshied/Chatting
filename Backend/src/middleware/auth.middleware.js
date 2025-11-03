import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ENV } from "../lib/env.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token)
      return res
        .status(401)
        .json({ message: "Gada izin - Token ga tersedia, maaf yaa :(" });

    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    if (!decoded)
      return res
        .status(401)
        .json({ message: "Gada izin - Tokennya ga valid, maaf ya :(" });

    const user = await User.findById(decoded.userId).select("-password");
    if (!user)
      return res.status(404).json({ message: "Yaaahh, penggunanya gada!" });

    req.user = user;
    next();
  } catch (error) {
    console.error("Ada kesalahan di middleware protectRoute:", error);
    res.status(500).json({ message: "Servernya lagi error 🗿" });
  }
};
