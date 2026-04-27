"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import {
  ChevronRight,
  Folder,
  FolderOpen,
  ImageIcon,
  LogOut,
  RefreshCcw,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { formatBytes } from "@/lib/format";
import type { FolderItem, ImageItem, User } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreateFolderDialog } from "./create-folder-dialog";
import { FolderTree } from "./folder-tree";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface DashboardClientProps {
  initialUser: User | null;
}

interface Breadcrumb {
  id: string | null;
  name: string;
}

const ROOT_BREADCRUMB: Breadcrumb = { id: null, name: "My Drive" };

export function DashboardClient({ initialUser }: DashboardClientProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(initialUser);
  const [allFolders, setAllFolders] = useState<FolderItem[]>([]);
  const [currentFolderChildren, setCurrentFolderChildren] = useState<FolderItem[]>([]);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);
  const [downloadingImageId, setDownloadingImageId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [error, setError] = useState<string>("");
  

  const [expandedFolderIds, setExpandedFolderIds] = useState<Set<string>>(new Set());
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const refreshAllFolders = useCallback(async () => {
    try {
      const response = await apiFetch<{ folders: FolderItem[] }>("/folders?all=true");
      setAllFolders(response.folders);
    } catch (err) {
      console.error("Failed to load folder tree:", err);
    }
  }, []);

  const refreshContents = useCallback(async (folderId: string | null) => {
    setIsLoading(true);
    setError("");
    setFeedback("");

    try {
      const query = folderId ? `?parentId=${folderId}` : "";
      
      const [folderResponse, imageResponse] = await Promise.all([
        apiFetch<{ folders: FolderItem[] }>(`/folders${query}`),
        folderId 
          ? apiFetch<{ images: ImageItem[] }>(`/images?folderId=${folderId}`) 
          : Promise.resolve({ images: [] })
      ]);
      
      setCurrentFolderChildren(folderResponse.folders);
      setImages(imageResponse.images);
      
      
      await refreshAllFolders();
      
    } catch (refreshError) {
      setError(refreshError instanceof Error ? refreshError.message : "Failed to load dashboard");
    } finally {
      setIsLoading(false);
    }
  }, [refreshAllFolders]);

  useEffect(() => {
    const boot = async () => {
      if (initialUser) {
        setUser(initialUser);
        await refreshAllFolders();
        await refreshContents(null);
        return;
      }

      try {
        const response = await apiFetch<{ user: User }>("/auth/me");
        setUser(response.user);
        await refreshAllFolders();
        await refreshContents(null);
      } catch {
        router.replace("/login");
      }
    };

    void boot();
  }, [initialUser, refreshAllFolders, refreshContents, router]);

  const buildFolderPath = useCallback((targetFolderId: string | null) => {
    if (!targetFolderId) {
      return [ROOT_BREADCRUMB];
    }

    const path: Breadcrumb[] = [];
    let currentId: string | null = targetFolderId;
    const seen = new Set<string>();

    while (currentId !== null && !seen.has(currentId)) {
      seen.add(currentId);
      const folder = allFolders.find((f) => f.id === currentId);
      if (folder) {
        path.unshift({ id: folder.id, name: folder.name });
        currentId = folder.parentFolderId;
      } else {
        break;
      }
    }

    return [ROOT_BREADCRUMB, ...path];
  }, [allFolders]);

  const breadcrumbs = useMemo(
    () => buildFolderPath(currentFolderId),
    [buildFolderPath, currentFolderId],
  );
  const currentFolderName = breadcrumbs[breadcrumbs.length - 1]?.name ?? "My Drive";
  const visibleExpandedFolderIds = useMemo(() => {
    const next = new Set(expandedFolderIds);
    breadcrumbs.forEach((crumb) => {
      if (crumb.id) {
        next.add(crumb.id);
      }
    });
    return next;
  }, [breadcrumbs, expandedFolderIds]);

  const handleSelectFolder = async (folder: FolderItem | null) => {
    setCurrentFolderId(folder?.id ?? null);

    if (folder) {
      setExpandedFolderIds((prev) => {
        const next = new Set(prev);
        next.add(folder.id);
        return next;
      });
    }

    await refreshContents(folder?.id ?? null);
  };

  const handleToggleFolderTree = (folderId: string) => {
    setExpandedFolderIds(prev => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  const handleBreadcrumbClick = async (crumbIndex: number) => {
    const target = breadcrumbs[crumbIndex];
    await handleSelectFolder(target?.id ? allFolders.find(f => f.id === target.id) || null : null);
  };

  const handleCreateFolder = async (name: string, parentFolderId: string | null) => {
    await apiFetch<FolderItem>("/folders", {
      method: "POST",
      body: {
        name,
        parentFolderId,
      },
    });

    setFeedback(`Created "${name}"`);
    

    if (parentFolderId) {
      setExpandedFolderIds(prev => {
        const next = new Set(prev);
        next.add(parentFolderId);
        return next;
      });
    }
    
    await refreshAllFolders();
    await refreshContents(parentFolderId);
  };

  const executeUpload = async (file: File) => {
    if (!currentFolderId) {
      setError("Open a folder before uploading");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("folderId", currentFolderId);

    setIsUploading(true);
    setError("");

    try {
      await apiFetch<ImageItem>("/images/upload", {
        method: "POST",
        body: formData,
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setFeedback(`Uploaded "${file.name}" successfully`);
      await refreshContents(currentFolderId);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (currentFolderId) setIsDraggingOver(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    
    if (!currentFolderId) {
      setError("Open a folder to upload images");
      return;
    }

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(f => f.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      setError("Only image files are supported");
      return;
    }
    
    if (imageFiles.length > 1) {
      setError("Please upload one image at a time for now");
      
      return;
    }

    await executeUpload(imageFiles[0]);
  };

  const handleLogout = async () => {
    await apiFetch("/auth/logout", { method: "POST" });
    router.replace("/login");
  };

  const handleDeleteImage = async (imageId: string, imageName: string) => {
    setDeletingImageId(imageId);
    setError("");

    try {
      await apiFetch<{ message: string; imageId: string }>(`/images/${imageId}`, {
        method: "DELETE",
      });
      setFeedback(`Deleted "${imageName}" successfully`);
      setSelectedImage((current) => (current?.id === imageId ? null : current));

      if (currentFolderId) {
        await refreshContents(currentFolderId);
      }
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Failed to delete image");
    } finally {
      setDeletingImageId(null);
    }
  };

  const handleDownloadImage = async (image: ImageItem) => {
    setDownloadingImageId(image.id);
    setError("");

    try {
      const response = await fetch(image.url);
      if (!response.ok) {
        throw new Error("Unable to download image");
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = image.name;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(objectUrl);
    } catch (downloadError) {
      setError(downloadError instanceof Error ? downloadError.message : "Failed to download image");
    } finally {
      setDownloadingImageId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.12),_transparent_40%),linear-gradient(180deg,#f8fbff_0%,#eef4ff_100%)]">

       <header className="flex items-center justify-between  border border-white/70 bg-white/75 px-5 py-6 shadow-sm backdrop-blur md:px-6">
      
  
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-2xl font-instrument-serif font-extrabold text-blue-600">
          <Folder className="w-6 h-6" />
          <Link href="/">Foldera</Link>
        </div>
      </div>

      
      <div className="flex items-center gap-3">
        

        <div className="hidden sm:flex flex-col items-end">
          <p className="text-sm font-semibold text-slate-900">
            {user?.email ?? "..."}
          </p>
          <p className="text-xs text-slate-500">
            Private Workspace
          </p>
        </div>


        <button
          onClick={handleLogout}
          className="inline-flex items-center rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </button>
      </div>
    </header>

      <div className="mx-auto flex max-w-[1600px] items-start gap-6 p-4 sm:p-6 lg:p-8">

        <aside className="sticky top-[88px] hidden w-[280px] shrink-0 flex-col gap-6 lg:flex">
          <Card className="border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm">
            <CardContent className="p-4">
              <CreateFolderDialog parentFolderId={currentFolderId} onCreate={handleCreateFolder} />
            </CardContent>
          </Card>

          <Card className="flex h-[calc(100vh-180px)] flex-col overflow-hidden border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm">
            <div className="border-b border-slate-100 p-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Folders</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              <FolderTree
                allFolders={allFolders}
                currentFolderId={currentFolderId}
                onSelect={handleSelectFolder}
                expandedIds={visibleExpandedFolderIds}
                onToggle={handleToggleFolderTree}
              />
            </div>
          </Card>
        </aside>

 
        <main className="flex-1 min-w-0 space-y-6">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <nav className="flex items-center space-x-1 overflow-hidden">
              {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1;
                return (
                  <div className="flex items-center" key={`${crumb.id ?? "root"}-${index}`}>
                    <button
                      type="button"
                      className={cn(
                        "truncate rounded-lg px-2 py-1.5 text-sm transition-colors max-w-[150px] sm:max-w-[200px]",
                        isLast 
                          ? "bg-slate-100 font-semibold text-slate-900" 
                          : "text-slate-500 hover:bg-slate-200/50 hover:text-slate-900"
                      )}
                      onClick={() => void handleBreadcrumbClick(index)}
                    >
                      {crumb.name}
                    </button>
                    {!isLast && <ChevronRight className="mx-1 h-4 w-4 shrink-0 text-slate-400" />}
                  </div>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              
              <div className="lg:hidden">
                <CreateFolderDialog parentFolderId={currentFolderId} onCreate={handleCreateFolder} />
              </div>
              <Button variant="outline" size="sm" onClick={() => void refreshContents(currentFolderId)} className="bg-white/80">
                <RefreshCcw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>

          {feedback ? <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 shadow-sm">{feedback}</p> : null}
          {error ? <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800 shadow-sm">{error}</p> : null}

    
          {currentFolderChildren.length > 0 && (
            <section>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500">Folders in {currentFolderName}</h3>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                {currentFolderChildren.map((folder) => (
                  <button
                    key={folder.id}
                    type="button"
                    onClick={() => void handleSelectFolder(folder)}
                    className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-all hover:border-sky-300 hover:shadow-md"
                  >
                    <div className="rounded-xl bg-sky-50 p-2.5 text-sky-500 transition-colors group-hover:bg-sky-100 group-hover:text-sky-600">
                      <Folder className="h-6 w-6" fill="currentColor" strokeWidth={1} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-slate-900">{folder.name}</p>
                      <p className="text-xs text-slate-500">
                        {new Date(folder.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}

   
          <section
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={cn(
              "relative overflow-hidden rounded-2xl border-2 border-dashed transition-all",
              !currentFolderId ? "border-slate-200 bg-slate-50/50 opacity-60" :
              isDraggingOver ? "border-sky-400 bg-sky-50" : "border-slate-300 bg-white/60 hover:bg-white"
            )}
          >
            <div className="flex flex-col items-center justify-center p-8 sm:p-10">
              <div className={cn(
                "mb-4 flex h-14 w-14 items-center justify-center rounded-full transition-colors",
                isDraggingOver ? "bg-sky-100 text-sky-600" : "bg-slate-100 text-slate-500"
              )}>
                <UploadCloud className="h-7 w-7" />
              </div>
              <h3 className="mb-1 text-lg font-semibold text-slate-900">
                {currentFolderId ? "Upload to this folder" : "Open a folder to upload"}
              </h3>
              <p className="mb-6 text-center text-sm text-slate-500 max-w-md">
                {currentFolderId 
                  ? "Drag and drop your images here, or click to browse files. Supported formats: JPG, PNG, GIF, WEBP."
                  : "Images must be stored inside folders. Navigate to a folder first."}
              </p>
              
              <div className="flex items-center gap-3">
                <input
                  ref={fileInputRef}
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                      void executeUpload(file);
                    }
                  }}
                  disabled={!currentFolderId || isUploading}
                />
                <Button 
                  disabled={!currentFolderId || isUploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 shadow-sm"
                >
                  {isUploading ? "Uploading..." : "Browse Files"}
                </Button>
              </div>
            </div>
            
     
            {!currentFolderId && (
              <div className="absolute inset-0 z-10" title="Navigate to a folder first" />
            )}
          </section>

    
          {currentFolderId && (
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                  Images in {currentFolderName}
                </h3>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                  {images.length} item{images.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              {isLoading ? (
                 <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-slate-200 bg-white/50 border-dashed">
                  <p className="text-slate-500 animate-pulse">Loading images...</p>
                 </div>
              ) : images.length ? (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {images.map((image) => (
                    <Card
                      key={image.id}
                      className="group cursor-pointer overflow-hidden border-slate-200 bg-white transition-all hover:border-sky-200 hover:shadow-md"
                      onClick={() => setSelectedImage(image)}
                    >
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                        <Image 
                          src={image.url} 
                          alt={image.name} 
                          fill 
                          className="object-cover transition-transform duration-500 group-hover:scale-105" 
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw" 
                        />
                      </div>
                      <CardContent className="p-3">
                        <p className="truncate text-sm font-semibold text-slate-900" title={image.name}>{image.name}</p>
                        <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
                          <span>{formatBytes(image.size)}</span>
                          <span>{new Date(image.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="mt-3 truncate text-xs text-slate-400">Click to preview, download, or delete</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex min-h-[200px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/50 p-8 text-center">
                  <ImageIcon className="mb-3 h-10 w-10 text-slate-300" />
                  <p className="font-medium text-slate-900">No images yet</p>
                  <p className="mt-1 text-sm text-slate-500">Upload your first image to populate this folder.</p>
                </div>
              )}
            </section>
          )}

          <Dialog open={selectedImage !== null} onOpenChange={(open) => !open && setSelectedImage(null)}>
            {selectedImage ? (
              <DialogContent className="max-w-5xl gap-5 border-slate-200 bg-white/98 p-5 sm:p-6">
                <DialogHeader className="pr-12">
                  <DialogTitle className="truncate">{selectedImage.name}</DialogTitle>
                  <DialogDescription>
                    {formatBytes(selectedImage.size)} • Added {new Date(selectedImage.createdAt).toLocaleDateString()}
                  </DialogDescription>
                </DialogHeader>

                <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-100">
                  <div className="relative aspect-[16/10] w-full">
                    <Image
                      src={selectedImage.url}
                      alt={selectedImage.name}
                      fill
                      className="object-contain"
                      sizes="100vw"
                      priority
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-slate-500">
                    Press <span className="font-semibold text-slate-700">Esc</span> or use the close icon to dismiss.
                  </p>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => void handleDownloadImage(selectedImage)}
                      disabled={downloadingImageId === selectedImage.id}
                    >
                      {downloadingImageId === selectedImage.id ? "Downloading..." : "Download"}
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => void handleDeleteImage(selectedImage.id, selectedImage.name)}
                      disabled={deletingImageId === selectedImage.id}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {deletingImageId === selectedImage.id ? "Deleting..." : "Delete image"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            ) : null}
          </Dialog>

       
          {!currentFolderId && allFolders.length === 0 && !isLoading && (
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <div className="mb-4 rounded-full bg-sky-50 p-4 text-sky-500">
                <FolderOpen className="h-12 w-12" />
              </div>
              <h2 className="mb-2 text-2xl font-bold text-slate-900">Welcome to Foldera</h2>
              <p className="mb-6 max-w-md text-slate-500">
                Your personal cloud drive is empty. Start by creating a folder to organize your images.
              </p>
              <CreateFolderDialog parentFolderId={currentFolderId} onCreate={handleCreateFolder} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
