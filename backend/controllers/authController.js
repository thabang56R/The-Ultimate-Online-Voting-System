import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import { successResponse } from "../utils/apiResponse.js";

export const registerUser = async (req, res, next) => {
  try {
    const { fullName, email, password, nationalId } = req.body;

    if (!fullName || !email || !password) {
      res.status(400);
      throw new Error("Full name, email and password are required");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400);
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      nationalId,
    });

    const token = generateToken({ id: user._id, role: user.role });

    return successResponse(
      res,
      {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        },
        token,
      },
      "User registered successfully",
      201
    );
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("Email and password are required");
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401);
      throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401);
      throw new Error("Invalid credentials");
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = generateToken({ id: user._id, role: user.role });

    return successResponse(
      res,
      {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        },
        token,
      },
      "Login successful"
    );
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    return successResponse(res, req.user, "Current user fetched");
  } catch (error) {
    next(error);
  }
};