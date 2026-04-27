import { Router } from "express";
import {
  deleteImage,
  listImages,
  uploadImage,
} from "../controllers/image.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  imageIdParamsSchema,
  imageListQuerySchema,
  imageUploadBodySchema,
} from "../utils/validation.js";

const router = Router();

router.use(requireAuth);
router.post("/upload", upload.single("image"), validate({ body: imageUploadBodySchema }), uploadImage);
router.get("/", validate({ query: imageListQuerySchema }), listImages);
router.delete("/:id", validate({ params: imageIdParamsSchema }), deleteImage);

export default router;
