import nodemailer from "nodemailer";
import envVars from "../config/validateEnv";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: envVars.EMAIL,
    pass: envVars.EMAIL_PASSWORD,
  },
});

class EmailService {
  async sendEmail(to: string, subject: string, text?: string, html?: string) {
    const mailOptions = {
      from: envVars.EMAIL,
      to,
      subject,
      text,
      html,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent:", info.response);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }
}

export const emailService = new EmailService();
