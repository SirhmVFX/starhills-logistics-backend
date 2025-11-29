import { EMAIL_VERIFICATION_TEMPLATE } from "./emailTemplates.js";
import sgMail from "./sendgrid.config.js";

export const sendWelcomeEmail = async (email, fullName) => {
  try {
    const msg = {
      to: email,
      from: {
        email: sender.email,
        name: sender.name,
      },
      subject: "Welcome to Starhills Logistics",
      html: WELCOME_EMAIL_TEMPLATE.replace("{name}", fullName),
      category: "Welcome Email",
    };

    const response = await sgMail.send(msg);
    return response;
  } catch (error) {}
};

export const sendPasswordResetEmail = async (email, fullName, otp) => {
  try {
    const msg = {
      to: email,
      from: {
        email: sender.email,
        name: sender.name,
      },
      subject: "Password Reset",
      html: PASSWORD_RESET_EMAIL_TEMPLATE.replace("{name}", fullName)
        .replace("{otp}", otp)
        .replace("{email}", email),
      category: "Password Reset Email",
    };

    const response = await sgMail.send(msg);
    return response;
  } catch (error) {}
};

export const sendOtpEmail = async (email, fullName, otp) => {
  try {
    const sender = {
      // Add this line to define the sender
      email: process.env.SENDGRID_FROM_EMAIL,
      name: process.env.SENDGRID_FROM_NAME || "Starhills Logistics",
    };

    const msg = {
      to: email,
      from: {
        email: sender.email,
        name: sender.name,
      },
      subject: "OTP Verification",
      html: EMAIL_VERIFICATION_TEMPLATE.replace(/{name}/g, fullName) // Use regex to replace all occurrences
        .replace(/{otp_code}/g, otp)
        .replace(/{email}/g, email),
      category: "OTP Verification Email",
    };

    console.log("Sending email with options:", {
      to: msg.to,
      from: msg.from,
      subject: msg.subject,
    });

    const response = await sgMail.send(msg);
    console.log("Email sent successfully:", response[0].statusCode);
    return true;
  } catch (error) {
    console.error("Error sending OTP email:", error);
    if (error.response) {
      console.error("Error response body:", error.response.body);
    }
    return false;
  }
};
