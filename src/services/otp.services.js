// import twilio from "twilio";

// const account_sid = process.env.TWILIO_ACCOUNT_SID;
// const auth_token = process.env.TWILIO_AUTH_TOKEN;

// export const sendOtp = async (phone, otp) => {
//   try {
//     const client = new twilio(account_sid, auth_token);

//     let toNumber;
//     if (phone.startsWith("0")) {
//       toNumber = `+234${phone.substring(1)}`;
//     } else if (phone.startsWith("234")) {
//       toNumber = `+${phone}`;
//     } else {
//       toNumber = phone;
//     }

//     let msgOptions = {
//       to: toNumber,
//       from: process.env.TWILIO_PHONE_NUMBER,
//       body: `Your Starhills Logistics OTP is: ${otp}. It expires in 5 minutes.`,
//     };

//     await client.messages.create(msgOptions);
//   } catch (error) {
//     console.error("Error sending OTP:", error);
//     throw new Error("Failed to send OTP");
//   }
// };

import axios from "axios";

export async function sendOtp(phone, otp) {
  try {
    console.log("Sending OTP:", { phone, otp });
    console.log(
      "Using API Key:",
      process.env.TERMII_API_KEY
        ? "***" + process.env.TERMII_API_KEY.slice(-4)
        : "Not set"
    );

    const payload = {
      to: phone,
      from: "N-Alert",
      sms: `Your Starhills Logistics OTP is: ${otp}. It expires in 5 minutes.`,
      type: "plain",
      channel: "generic",
      api_key: process.env.TERMII_API_KEY,
    };

    console.log("Sending payload:", JSON.stringify(payload, null, 2));

    const response = await axios.post(
      "https://api.ng.termii.com/api/sms/send",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        timeout: 10000, // 10 seconds timeout
      }
    );

    console.log("OTP API Response:", response.data);
    return true;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw new Error("Failed to send OTP");
  }
}
