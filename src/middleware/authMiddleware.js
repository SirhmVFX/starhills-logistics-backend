import { verifyAccessToken } from "../utils/jwtUtils.js";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const accessToken = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : req.cookies?.access_token;

  if (!accessToken)
    return res.status(401).json({ success: false, message: "No access token" });

  try {
    const payload = verifyAccessToken(accessToken);
    if (!payload?.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload",
      });
    }
    req.user = {
      id: payload.id, // Ensure id is set
      email: payload.email,
    };
    return next();
  } catch (err) {
    console.error("Token verification error:", err);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
