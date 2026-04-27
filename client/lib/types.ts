export interface User {
  id: string;
  email: string;
}

export interface FolderItem {
  id: string;
  name: string;
  userId: string;
  parentFolderId: string | null;
  createdAt: string;
  updatedAt: string;
  size?: number;
}

export interface ImageItem {
  id: string;
  name: string;
  url: string;
  publicId: string;
  size: number;
  folderId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
