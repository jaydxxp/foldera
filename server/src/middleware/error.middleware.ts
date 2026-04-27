import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/apiError.js";

export const notFoundHandler = (_req: Request, _res: Response, next: NextFunction) => {
  next(new ApiError(404, "Route not found"));
};

export const errorHandler = (
  error: Error & Partial<ApiError>,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const statusCode = error.statusCode ?? 500;

  res.status(statusCode).json({
    message: error.message || "Something went wrong",
    ...(error.details ? { details: error.details } : {}),
  });
};
