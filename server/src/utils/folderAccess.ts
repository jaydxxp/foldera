import { isValidObjectId, Types } from "mongoose";
import { Folder } from "../models/Folder.js";
import { ApiError } from "./apiError.js";

export const toObjectId = (value: string, fieldName = "id") => {
  if (!isValidObjectId(value)) {
    throw new ApiError(400, `Invalid ${fieldName}`);
  }

  return new Types.ObjectId(value);
};

export const getOwnedFolderOrThrow = async (folderId: string, userId: string) => {
  const folderObjectId = toObjectId(folderId, "folderId");
  const userObjectId = toObjectId(userId, "userId");
  const folder = await Folder.findOne({ _id: folderObjectId, userId: userObjectId });

  if (!folder) {
    throw new ApiError(404, "Folder not found");
  }

  return folder;
};
