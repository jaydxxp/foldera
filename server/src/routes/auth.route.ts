import { Router } from "express";
import { login, logout, me, signup } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { authBodySchema } from "../utils/validation.js";

const router = Router();

router.post("/signup", validate({ body: authBodySchema }), signup);
router.post("/login", validate({ body: authBodySchema }), login);
router.post("/logout", logout);
router.get("/me", requireAuth, me);

export default router;
