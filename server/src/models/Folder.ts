import { Schema, Types, model } from "mongoose";

export interface IFolder {
  name: string;
  userId: Types.ObjectId;
  parentFolderId: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const folderSchema = new Schema<IFolder>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    parentFolderId: {
      type: Schema.Types.ObjectId,
      ref: "Folder",
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

folderSchema.index({ userId: 1, parentFolderId: 1 });

export const Folder = model<IFolder>("Folder", folderSchema);
