import nodemailer from "nodemailer";
import envVars from "../config/validateEnv";
import logger from "../utils/logger";

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
      await transporter.sendMail(mailOptions);
    } catch (error) {
      logger.error("Error sending email:", error);
    }
  }
}

export const emailService = new EmailService();
