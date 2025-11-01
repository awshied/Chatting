import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { ENV } from "../lib/env.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Isi semua kolomnya yaaa 💖" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Passwordnya harus minimal ada 6 karakter ☠️" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ message: "Sayang sekali, emailnya ga valid ☹️" });
    }

    const user = await User.findOne({ email });
    if (user)
      return res
        .status(400)
        .json({ message: "Email sudah terpakai, coba pikirin email lain 😭" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      // generateToken(newUser._id, res);
      // await newUser.save();

      const savedUser = await newUser.save();
      generateToken(savedUser._id, res);

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });

      try {
        await sendWelcomeEmail(
          savedUser.email,
          savedUser.fullName,
          ENV.CLIENT_URL
        );
      } catch (error) {
        console.error("Gagal mengirimkan email:", error);
      }
    } else {
      res.status(400).json({ message: "Duhh! Datamu ga valid ⚔️" });
    }
  } catch (error) {
    console.log("Wah, ga bisa signup dulu:", error);
    res.status(500).json({ message: "Servernya lagi error 🗿" });
  }
};
