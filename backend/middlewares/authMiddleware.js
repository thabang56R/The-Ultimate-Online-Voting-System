import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { env } from "../config/env.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      res.status(401);
      throw new Error("Not authorized, no token provided");
    }

    const decoded = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      res.status(401);
      throw new Error("User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    next(error);
  }
};

export const adminOnly = (req, res, next) => {
  try {
    if (!req.user) {
      res.status(401);
      throw new Error("Not authorized");
    }

    const userRole = String(req.user.role || "").toLowerCase();

    if (userRole !== "admin") {
      res.status(403);
      throw new Error("Access denied. Admins only");
    }

    next();
  } catch (error) {
    next(error);
  }
};