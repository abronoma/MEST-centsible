import { expressjwt } from "express-jwt";
import { userModel } from "../models/User.mjs";

export const isAuthenticated = expressjwt({
  secret: process.env.JWT_SECRET_KEY,
  algorithms: ["HS256"],
});

export const isAuthorized = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.auth.id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized user" });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
