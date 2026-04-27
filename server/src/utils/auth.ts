import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";

export const AUTH_COOKIE_NAME = "foldera_token";

export const signJwt = (userId: string) =>
  jwt.sign({ userId }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"],
  });

export const verifyJwt = (token: string) =>
  jwt.verify(token, env.jwtSecret) as { userId: string };
