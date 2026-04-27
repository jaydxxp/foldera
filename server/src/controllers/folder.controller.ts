import { Types } from "mongoose";
import type { Request, Response } from "express";
import { Folder } from "../models/Folder.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getOwnedFolderOrThrow, toObjectId } from "../utils/folderAccess.js";
import { calculateFolderSize } from "../utils/folderSize.js";
import { ImageModel } from "../models/Image.js";

const formatFolder = (folder: {
  _id: unknown;
  name: string;
  userId: Types.ObjectId;
  parentFolderId: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}) => ({
  id: String(folder._id),
  name: folder.name,
  userId: String(folder.userId),
  parentFolderId: folder.parentFolderId ? String(folder.parentFolderId) : null,
  createdAt: folder.createdAt,
  updatedAt: folder.updatedAt,
});

export const createFolder = asyncHandler(async (req: Request, res: Response) => {
  const { name, parentFolderId } = req.body as { name: string; parentFolderId?: string | null };
  const userId = req.user?.userId;

  if (!userId) {
    throw new ApiError(401, "Authentication required");
  }

  let normalizedParentFolderId: Types.ObjectId | null = null;

  if (parentFolderId) {
    const parentFolder = await getOwnedFolderOrThrow(parentFolderId, userId);
    normalizedParentFolderId = parentFolder._id;
  }

  const folder = await Folder.create({
    name,
    userId: toObjectId(userId, "userId"),
    parentFolderId: normalizedParentFolderId,
  });

  res.status(201).json(formatFolder(folder));
});

export const listFolders = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw new ApiError(401, "Authentication required");
  }

  const parentId = req.query.parentId as string | undefined;
  const all = req.query.all === "true";

  if (all) {
    const folders = await Folder.find({
      userId: toObjectId(userId, "userId"),
    }).sort({ name: 1, createdAt: -1 });

    const images = await ImageModel.aggregate([
      { $match: { userId: toObjectId(userId, "userId") } },
      { $group: { _id: "$folderId", totalSize: { $sum: "$size" } } }
    ]);

    const sizeMap = new Map<string, number>();
    for (const img of images) {
      sizeMap.set(String(img._id), img.totalSize);
    }

    const memo = new Map<string, number>();
    const calcSize = (folderId: string): number => {
      if (memo.has(folderId)) return memo.get(folderId)!;
      let size = sizeMap.get(folderId) || 0;
      for (const f of folders) {
        if (f.parentFolderId && String(f.parentFolderId) === folderId) {
          size += calcSize(String(f._id));
        }
      }
      memo.set(folderId, size);
      return size;
    };

    const foldersWithSize = folders.map((f) => {
      const formatted = formatFolder(f);
      return { ...formatted, size: calcSize(formatted.id) };
    });

    res.json({ folders: foldersWithSize });
    return;
  }

  const query: {
    userId: Types.ObjectId;
    parentFolderId: Types.ObjectId | null;
  } = {
    userId: toObjectId(userId, "userId"),
    parentFolderId: null,
  };

  if (parentId) {
    const parentFolder = await getOwnedFolderOrThrow(parentId, userId);
    query.parentFolderId = parentFolder._id;
  }

  const folders = await Folder.find(query).sort({ createdAt: -1 });
  res.json({ folders: folders.map(formatFolder) });
});

export const getFolderSize = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw new ApiError(401, "Authentication required");
  }

  const rawFolderId = req.params.id;
  const folderId = Array.isArray(rawFolderId) ? rawFolderId[0] : rawFolderId;

  if (!folderId) {
    throw new ApiError(400, "Folder id is required");
  }

  const folder = await getOwnedFolderOrThrow(folderId, userId);
  const totalSizeBytes = await calculateFolderSize(folder._id, toObjectId(userId, "userId"));

  res.json({
    folderId: String(folder._id),
    totalSizeBytes,
  });
});
