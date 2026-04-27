import type { Request } from "express";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      userId: string;
    };
  }
}

export type AuthenticatedRequest = Request;
