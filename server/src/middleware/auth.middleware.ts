import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/apiError.js";
import { AUTH_COOKIE_NAME, verifyJwt } from "../utils/auth.js";

export const requireAuth = (req: Request, _res: Response, next: NextFunction) => {
  const token = req.cookies[AUTH_COOKIE_NAME];

  if (!token) {
    next(new ApiError(401, "Authentication required"));
    return;
  }

  try {
    const payload = verifyJwt(token);
    req.user = { userId: payload.userId };
    next();
  } catch {
    next(new ApiError(401, "Invalid or expired token"));
  }
};
