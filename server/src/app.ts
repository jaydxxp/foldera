import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware.js";
import authRoutes from "./routes/auth.route.js";
import folderRoutes from "./routes/folder.route.js";
import imageRoutes from "./routes/image.route.js";
import mcpRoutes from "./routes/mcp.route.js";

export const app = express();

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/mcp", mcpRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
