"use client";

import { ChevronRight, Folder, FolderOpen, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatBytes } from "@/lib/format";
import type { FolderItem } from "@/lib/types";

interface TreeNode extends FolderItem {
  children: TreeNode[];
}

function buildTree(folders: FolderItem[], parentId: string | null): TreeNode[] {
  return folders
    .filter((f) => f.parentFolderId === parentId)
    .map((f) => ({ ...f, children: buildTree(folders, f.id) }));
}

interface FolderNodeProps {
  node: TreeNode;
  depth: number;
  currentFolderId: string | null;
  onSelect: (folder: FolderItem) => void;
  expandedIds: Set<string>;
  onToggle: (id: string) => void;
}

function FolderNode({ node, depth, currentFolderId, onSelect, expandedIds, onToggle }: FolderNodeProps) {
  const isExpanded = expandedIds.has(node.id);
  const isActive = currentFolderId === node.id;
  const hasChildren = node.children.length > 0;

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          onSelect(node);
          if (hasChildren) onToggle(node.id);
        }}
        className={cn(
          "group flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm transition-all duration-150",
          isActive
            ? "bg-sky-100 font-semibold text-sky-700"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
        )}
        style={{ paddingLeft: `${12 + depth * 16}px` }}
      >
      
        <span
          onClick={(e) => {
            e.stopPropagation();
            if (hasChildren) onToggle(node.id);
          }}
          className={cn(
            "flex h-4 w-4 shrink-0 items-center justify-center rounded transition-transform duration-200",
            hasChildren ? "text-slate-400 group-hover:text-slate-600" : "opacity-0",
            isExpanded ? "rotate-90" : "",
          )}
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </span>

      
        <span className={cn("shrink-0 transition-colors", isActive ? "text-sky-600" : "text-amber-500")}>
          {isActive ? <FolderOpen className="h-4 w-4" /> : <Folder className="h-4 w-4" />}
        </span>

        <span className="truncate">{node.name}</span>

        {(node.size ?? 0) > 0 && (
          <span
            className={cn(
              "ml-auto shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
              isActive ? "bg-sky-200 text-sky-700" : "bg-slate-200 text-slate-500",
            )}
          >
            {formatBytes(node.size || 0)}
          </span>
        )}
      </button>

      
      {isExpanded && hasChildren && (
        <div className="relative">
        
          <div
            className="absolute bottom-2 top-1 w-px bg-slate-200"
            style={{ left: `${20 + depth * 16}px` }}
          />
          {node.children.map((child) => (
            <FolderNode
              key={child.id}
              node={child}
              depth={depth + 1}
              currentFolderId={currentFolderId}
              onSelect={onSelect}
              expandedIds={expandedIds}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface FolderTreeProps {
  allFolders: FolderItem[];
  currentFolderId: string | null;
  onSelect: (folder: FolderItem | null) => void;
  expandedIds: Set<string>;
  onToggle: (id: string) => void;
}

export function FolderTree({ allFolders, currentFolderId, onSelect, expandedIds, onToggle }: FolderTreeProps) {
  const tree = buildTree(allFolders, null);

  return (
    <nav className="space-y-0.5">

      <button
        type="button"
        onClick={() => onSelect(null)}
        className={cn(
          "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-150",
          currentFolderId === null
            ? "bg-sky-100 text-sky-700"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
        )}
      >
        <Home className={cn("h-4 w-4 shrink-0", currentFolderId === null ? "text-sky-600" : "text-slate-400")} />
        <span>My Drive</span>
        <span
          className={cn(
            "ml-auto rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
            currentFolderId === null ? "bg-sky-200 text-sky-700" : "bg-slate-200 text-slate-500",
          )}
        >
          {formatBytes(allFolders.filter((f) => f.parentFolderId === null).reduce((acc, f) => acc + (f.size || 0), 0))}
        </span>
      </button>

      {tree.length === 0 ? (
        <p className="px-4 py-3 text-xs text-slate-400">No folders yet</p>
      ) : (
        tree.map((node) => (
          <FolderNode
            key={node.id}
            node={node}
            depth={0}
            currentFolderId={currentFolderId}
            onSelect={(f) => onSelect(f)}
            expandedIds={expandedIds}
            onToggle={onToggle}
          />
        ))
      )}
    </nav>
  );
}
