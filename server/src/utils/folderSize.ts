import { Types } from "mongoose";
import { Folder } from "../models/Folder.js";
import { ImageModel } from "../models/Image.js";

export const calculateFolderSize = async (
  folderId: Types.ObjectId,
  userId: Types.ObjectId,
): Promise<number> => {
  const images = await ImageModel.find({ folderId, userId }).select("size");
  const imageSize = images.reduce((sum, image) => sum + image.size, 0);

  const childFolders = await Folder.find({ parentFolderId: folderId, userId }).select("_id");
  const childSizes = await Promise.all(
    childFolders.map((childFolder) => calculateFolderSize(childFolder._id, userId)),
  );

  return imageSize + childSizes.reduce((sum, size) => sum + size, 0);
};
