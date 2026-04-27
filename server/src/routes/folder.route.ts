import { Router } from "express";
import {
  createFolder,
  getFolderSize,
  listFolders,
} from "../controllers/folder.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  createFolderBodySchema,
  folderIdParamsSchema,
  listFoldersQuerySchema,
} from "../utils/validation.js";

const router = Router();

router.use(requireAuth);
router.post("/", validate({ body: createFolderBodySchema }), createFolder);
router.get("/", validate({ query: listFoldersQuerySchema }), listFolders);
router.get("/:id/size", validate({ params: folderIdParamsSchema }), getFolderSize);

export default router;
