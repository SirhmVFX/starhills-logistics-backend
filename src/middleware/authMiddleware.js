import { verifyAccessToken } from "../utils/jwtUtils.js";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const accessToken = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : req.cookies?.access_token;

  if (!accessToken) return res.status(401).json({ message: "No access token" });

  try {
    const payload = verifyAccessToken(accessToken);
    req.user = { id: payload.id, email: payload.email };
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired access token" });
  }
};
