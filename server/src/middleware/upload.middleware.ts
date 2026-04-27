import multer from "multer";
import { ApiError } from "../utils/apiError.js";

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new ApiError(400, "Only image uploads are allowed"));
      return;
    }

    cb(null, true);
  },
});
