import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import { User } from "../models/User.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AUTH_COOKIE_NAME, signJwt } from "../utils/auth.js";
import { getAuthCookieOptions } from "../utils/cookies.js";

const formatUser = (user: { _id: unknown; email: string }) => ({
  id: String(user._id),
  email: user.email,
});

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    email,
    password: hashedPassword,
  });

  const token = signJwt(String(user._id));
  res.cookie(AUTH_COOKIE_NAME, token, getAuthCookieOptions());
  res.status(201).json({ user: formatUser(user) });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = signJwt(String(user._id));
  res.cookie(AUTH_COOKIE_NAME, token, getAuthCookieOptions());
  res.json({ user: formatUser(user) });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie(AUTH_COOKIE_NAME, getAuthCookieOptions());
  res.json({ message: "Logged out successfully" });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user?.userId) {
    throw new ApiError(401, "Authentication required");
  }

  const user = await User.findById(req.user.userId).select("email");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.json({ user: formatUser(user) });
});
