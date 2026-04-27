import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listMcpTools = asyncHandler(async (_req: Request, res: Response) => {
  res.json([
    {
      name: "createFolder",
      description: "Create a folder",
      endpoint: "/api/folders",
      method: "POST",
    },
    {
      name: "uploadImage",
      description: "Upload image",
      endpoint: "/api/images/upload",
      method: "POST",
    },
  ]);
});
