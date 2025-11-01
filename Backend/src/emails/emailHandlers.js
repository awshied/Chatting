import { resendClient, sender } from "../lib/resend.js";
import { createWelcomeEmailTemplate } from "../emails/emailTemplates.js";

export const sendWelcomeEmail = async (email, name, clientURL) => {
  const { data, error } = await resendClient.emails.send({
    from: `${sender.name} <${sender.email}>`,
    to: email,
    subject: "Selamat Datang",
    html: createWelcomeEmailTemplate(name, clientURL),
  });

  if (error) {
    console.error("Terjadi kesalahan saat mengirim email:", error);
    throw new Error("Gagal mengirim pesan");
  }

  console.log("Email berhasil dikirim", data);
};
