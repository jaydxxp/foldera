import { z } from "zod";

const objectIdMessage = "Must be a valid MongoDB ObjectId";

export const objectIdSchema = z.string().trim().regex(/^[a-f\d]{24}$/i, objectIdMessage);

export const authBodySchema = z.object({
  email: z.email("Invalid email address").transform((value) => value.toLowerCase().trim()),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const createFolderBodySchema = z.object({
  name: z.string().trim().min(1, "Folder name is required").max(100, "Folder name is too long"),
  parentFolderId: objectIdSchema.nullable().optional(),
});

export const listFoldersQuerySchema = z.object({
  parentId: objectIdSchema.optional(),
  all: z.enum(["true", "false"]).optional(),
});

export const folderIdParamsSchema = z.object({
  id: objectIdSchema,
});

export const imageListQuerySchema = z.object({
  folderId: objectIdSchema,
});

export const imageUploadBodySchema = z.object({
  folderId: objectIdSchema,
});

export const imageIdParamsSchema = z.object({
  id: objectIdSchema,
});
