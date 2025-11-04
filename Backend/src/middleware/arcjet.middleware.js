import aj from "../lib/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";

export const arcjetProtection = async (req, res, next) => {
  try {
    const decision = await aj.protect(req);

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({
          message:
            "Batas penggunaan udah kebanyakan nih. Jadi baru bisa dicoba lagi lain waktu 🥺",
        });
      } else if (decision.reason.isBot()) {
        return res.status(403).json({ message: "Akses untuk bot ditolak!" });
      } else {
        return res.status(403).json({
          message:
            "Maaf banget karena akses lu ditolak oleh kebijakan keamanan",
        });
      }
    }

    if (decision.results.some(isSpoofedBot)) {
      return res.status(403).json({
        error: "Bot palsu terdeteksi",
        message: "Aktivitas bot yang berbahaya telah terdeteksi 👍🏼",
      });
    }
    next();
  } catch (error) {
    console.error("Terjadi kerusakan pada pelindung Arcjet:", error);
    next();
  }
};
