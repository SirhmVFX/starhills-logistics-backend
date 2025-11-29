export const EMAIL_VERIFICATION_TEMPLATE = `
<!DOCTYPE html>
<html>
  <body style="margin:0; padding:0; background:#F8F8FF; font-family:Arial, sans-serif;">
    <div style="max-width:600px; margin:auto; background:white; border-radius:16px; padding:40px;">
      
      <h2 style="color:#4B3BAC; font-size:24px; margin-bottom:10px;">
        Verify Your Email
      </h2>

      <p style="color:#1A1A1A; font-size:15px; line-height:22px;">
        Hi there, welcome to <strong>Starhills Logistics</strong> 🚚✨  
        Please use the OTP code below to verify your email address and activate your account.
      </p>

      <div style="text-align:center; margin:30px 0;">
        <p style="font-size:18px; font-weight:bold; color:#4B3BAC;">
          Your OTP Code: <strong>{{otp_code}}</strong>
        </p>
      </div>

      <p style="font-size:14px; color:#6B7280;">
        If you didn’t sign up for this account, you can safely ignore this email.
      </p>

    </div>
  </body>
</html>

`;

export const PASSWORD_RESET_TEMPLATE = `
<!DOCTYPE html>
<html>
  <body style="margin:0; padding:0; background:#F8F8FF; font-family:Arial, sans-serif;">
    <div style="max-width:600px; margin:auto; background:white; border-radius:16px; padding:40px;">
      
      <h2 style="color:#4B3BAC; font-size:24px; margin-bottom:10px;">
        Reset Your Password
      </h2>

      <p style="color:#1A1A1A; font-size:15px; line-height:22px;">
        We've received a request to reset your password.  
        If you made this request, click the button below to continue.
      </p>

      <div style="text-align:center; margin:30px 0;">
        <a href="{{reset_link}}"
          style="background:#3B82F6; color:white; padding:14px 28px;
          border-radius:10px; text-decoration:none; font-weight:bold;">
          Reset Password
        </a>
      </div>

      <p style="font-size:14px; color:#6B7280;">
        If you didn’t request a password reset, please ignore this message.
      </p>

    </div>
  </body>
</html>
`;

export const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html>
  <body style="margin:0; padding:0; background:#F8F8FF; font-family:Arial, sans-serif;">
    <div style="max-width:600px; margin:auto; background:white; border-radius:16px; padding:40px;">
      
      <h2 style="color:#4B3BAC; font-size:24px; margin-bottom:10px;">
        Password Updated Successfully
      </h2>

      <p style="color:#1A1A1A; font-size:15px; line-height:22px;">
        Your password has been changed.  
        If you did not perform this action, please secure your account immediately.
      </p>

      <p style="color:#6B7280; font-size:14px; margin-top:20px;">
        Stay safe,<br>
        <strong>Starhills Logistics Team</strong>
      </p>

    </div>
  </body>
</html>
`;

export const WELCOME_TEMPLATE = `
<!DOCTYPE html>
<html>
  <body style="margin:0; padding:0; background:#F6F5FF; font-family:Arial, sans-serif;">
    <div style="max-width:600px; margin:auto; background:white; border-radius:16px; padding:40px;">
      
      <h2 style="color:#4B3BAC; font-size:26px; margin-bottom:10px;">
        Welcome to Starhills Logistics 🚚💜
      </h2>

      <p style="color:#1A1A1A; font-size:15px; line-height:22px;">
        We’re excited to have you on board!  
        Your account is now ready, and you can start sending packages, tracking deliveries, and booking riders instantly.
      </p>

      <div style="text-align:center; margin:30px 0;">
        <a href="{{dashboard_link}}"
          style="background:#4B3BAC; color:white; padding:14px 28px;
          border-radius:10px; text-decoration:none; font-weight:bold;">
          Go to Dashboard
        </a>
      </div>

      <p style="font-size:14px; color:#6B7280;">
        Need help? We're always here for you.
      </p>

    </div>
  </body>
</html>
`;
