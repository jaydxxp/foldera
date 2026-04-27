import type { Request, Response } from "express";
import { ImageModel } from "../models/Image.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteFromCloudinary, uploadBufferToCloudinary } from "../utils/cloudinary.js";
import { getOwnedFolderOrThrow, toObjectId } from "../utils/folderAccess.js";

const formatImage = (image: {
  _id: unknown;
  name: string;
  url: string;
  publicId: string;
  size: number;
  folderId: unknown;
  userId: unknown;
  createdAt: Date;
  updatedAt: Date;
}) => ({
  id: String(image._id),
  name: image.name,
  url: image.url,
  publicId: image.publicId,
  size: image.size,
  folderId: String(image.folderId),
  userId: String(image.userId),
  createdAt: image.createdAt,
  updatedAt: image.updatedAt,
});

export const uploadImage = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { folderId } = req.body as { folderId: string };

  if (!userId) {
    throw new ApiError(401, "Authentication required");
  }

  if (!req.file) {
    throw new ApiError(400, "Image file is required");
  }

  const folder = await getOwnedFolderOrThrow(folderId, userId);
  const uploadResult = await uploadBufferToCloudinary(
    req.file.buffer,
    req.file.originalname,
    `foldera/${userId}`,
  );

  const image = await ImageModel.create({
    name: req.file.originalname || uploadResult.originalFilename,
    url: uploadResult.secureUrl,
    publicId: uploadResult.publicId,
    size: uploadResult.bytes,
    folderId: folder._id,
    userId: toObjectId(userId, "userId"),
  });

  res.status(201).json(formatImage(image));
});

export const listImages = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { folderId } = req.query as { folderId: string };

  if (!userId) {
    throw new ApiError(401, "Authentication required");
  }

  const folder = await getOwnedFolderOrThrow(folderId, userId);
  const images = await ImageModel.find({
    folderId: folder._id,
    userId: toObjectId(userId, "userId"),
  }).sort({ createdAt: -1 });

  res.json({ images: images.map(formatImage) });
});

export const deleteImage = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { id: imageId } = req.params as { id: string };

  if (!userId) {
    throw new ApiError(401, "Authentication required");
  }

  const image = await ImageModel.findOne({
    _id: toObjectId(imageId, "imageId"),
    userId: toObjectId(userId, "userId"),
  });

  if (!image) {
    throw new ApiError(404, "Image not found");
  }

  await deleteFromCloudinary(image.publicId);
  await image.deleteOne();

  res.json({
    message: "Image deleted successfully",
    imageId,
  });
});
