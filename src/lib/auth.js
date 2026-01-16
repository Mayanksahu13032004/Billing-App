import jwt from "jsonwebtoken";
import User from "@/models/User";

export const signToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });

export const verifyToken = (token) =>
  jwt.verify(token, process.env.JWT_SECRET);

/* ================= GET USER FROM REQUEST ================= */
export const getUserFromToken = async (request) => {
  try {
    const cookieHeader = request.headers.get("cookie");
    if (!cookieHeader) return null;

    const tokenMatch = cookieHeader.match(/token=([^;]+)/);
    if (!tokenMatch) return null;

    const token = tokenMatch[1];

    const decoded = verifyToken(token);
    if (!decoded?.id) return null;

    const user = await User.findById(decoded.id).select("name email");
    return user;
  } catch (error) {
    console.error("AUTH ERROR:", error);
    return null;
  }
};
