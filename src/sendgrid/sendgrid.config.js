import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sender = {
  email: "sirhmvfx@gmail.com",
  name: "Vancore",
};

export default sgMail;
