import { Router } from "express";
import { listMcpTools } from "../controllers/mcp.controller.js";

const router = Router();

router.get("/tools", listMcpTools);

export default router;
