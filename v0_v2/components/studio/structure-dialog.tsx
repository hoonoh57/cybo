'use client';

import { useState } from 'react';
import { X, ChevronRight, ChevronDown, Layout, Clock, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useStudioStore, useSelectedProject, useProjectStats } from '@/lib/studio-store';
import type { TreeNode, NodeStatus } from '@/lib/studio-types';
import { cn } from '@/lib/utils';

function StatusDot({ status }: { status: NodeStatus }) {
  const colors: Record<NodeStatus, string> = {
    done: 'bg-[#00c853]',
    progress: 'bg-[#ffd600]',
    prompt: 'bg-[#448aff]',
    empty: 'bg-[#555555]',
  };
  
  return (
    <span 
      className={cn('w-2 h-2 rounded-full shrink-0', colors[status])}
    />
  );
}

interface FullTreeNodeProps {
  node: TreeNode;
  level: number;
  onSelect: (node: TreeNode) => void;
  selectedId: string | null;
}

function FullTreeNode({ node, level, onSelect, selectedId }: FullTreeNodeProps) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedId === node.id;
  
  return (
    <div>
      <div
        onClick={() => onSelect(node)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect(node);
          }
        }}
        className={cn(
          'w-full flex items-center gap-2 px-2 py-1.5 text-sm transition-colors duration-200 rounded-sm cursor-pointer',
          'hover:bg-[#1e1e3a]/60',
          isSelected && 'bg-[#1e1e3a] border-l-[3px] border-l-[#6c63ff]'
        )}
        style={{ paddingLeft: `${level * 20 + 8}px` }}
      >
        {hasChildren ? (
          <span
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                setExpanded(!expanded);
              }
            }}
            className="p-0.5 hover:bg-[#2a2a4a] rounded cursor-pointer"
          >
            {expanded ? (
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-3 h-3 text-muted-foreground" />
            )}
          </span>
        ) : (
          <span className="w-4" />
        )}
        <Layout className="w-4 h-4 text-muted-foreground shrink-0" />
        <span className="flex-1 text-left truncate text-foreground">{node.name}</span>
        <StatusDot status={node.status} />
      </div>
      
      {hasChildren && expanded && (
        <div>
          {node.children!.map((child) => (
            <FullTreeNode
              key={child.id}
              node={child}
              level={level + 1}
              onSelect={onSelect}
              selectedId={selectedId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function NodeDetails({ node }: { node: TreeNode | null }) {
  if (!node) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        Select a node to view details
      </div>
    );
  }
  
  const statusLabels: Record<NodeStatus, string> = {
    done: 'Completed',
    progress: 'In Progress',
    prompt: 'Prompt Ready',
    empty: 'Empty',
  };
  
  // Generate mock version history
  const versionHistory = [];
  const versionCount = node.versionCount || 0;
  for (let i = versionCount; i > 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - (versionCount - i) * 2);
    versionHistory.push({
      version: i,
      date: date.toLocaleDateString(),
      note: i === versionCount ? 'Current version' : `Version ${i}`,
    });
  }
  
  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        {/* Header */}
        <div>
          <h3 className="text-lg font-semibold text-white">{node.name}</h3>
          <div className="flex items-center gap-2 mt-2">
            <StatusDot status={node.status} />
            <span className="text-sm text-muted-foreground">
              {statusLabels[node.status]}
            </span>
          </div>
        </div>
        
        {/* Description */}
        {node.description && (
          <div>
            <h4 className="text-sm font-medium text-white mb-2">Description</h4>
            <p className="text-sm text-muted-foreground">{node.description}</p>
          </div>
        )}
        
        {/* Prompt */}
        {node.prompt && (
          <div>
            <h4 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Prompt
            </h4>
            <div className="p-3 rounded-md bg-[#0d0d20] border border-[#2a2a4a]">
              <pre className="text-xs font-mono text-foreground whitespace-pre-wrap">
                {node.prompt}
              </pre>
            </div>
          </div>
        )}
        
        {/* File Info */}
        {node.filePath && (
          <div>
            <h4 className="text-sm font-medium text-white mb-2">File Info</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Path</span>
                <span className="text-foreground font-mono text-xs">{node.filePath}</span>
              </div>
              {node.fileSize && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Size</span>
                  <span className="text-foreground">{(node.fileSize / 1024).toFixed(1)} KB</span>
                </div>
              )}
              {node.lastModified && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Modified</span>
                  <span className="text-foreground">
                    {new Date(node.lastModified).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Version History */}
        {versionHistory.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Version History
            </h4>
            <div className="relative pl-4 border-l-2 border-[#2a2a4a] space-y-4">
              {versionHistory.map((v, i) => (
                <div key={v.version} className="relative">
                  <div className={cn(
                    'absolute -left-[21px] w-3 h-3 rounded-full border-2',
                    i === 0 
                      ? 'bg-[#6c63ff] border-[#6c63ff]' 
                      : 'bg-[#111128] border-[#2a2a4a]'
                  )} />
                  <div>
                    <div className="text-sm text-foreground">v{v.version}</div>
                    <div className="text-xs text-muted-foreground">{v.date}</div>
                    <div className="text-xs text-muted-foreground">{v.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}

export function StructureDialog() {
  const { isStructureDialogOpen, setStructureDialogOpen } = useStudioStore();
  const project = useSelectedProject();
  const stats = useProjectStats();
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  
  if (!project) return null;
  
  return (
    <Dialog open={isStructureDialogOpen} onOpenChange={setStructureDialogOpen}>
      <DialogContent 
        className="max-w-[80vw] h-[80vh] p-0 bg-[#111128] border-[#2a2a4a] overflow-hidden"
        showCloseButton={false}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2a2a4a]">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-white">
              Project Structure - {project.name}
            </DialogTitle>
          </DialogHeader>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setStructureDialogOpen(false)}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-[#1e1e3a]"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left: Tree View */}
          <div className="w-1/2 border-r border-[#2a2a4a]">
            <ScrollArea className="h-[calc(80vh-120px)]">
              <div className="p-4">
                {project.nodes.map((node) => (
                  <FullTreeNode
                    key={node.id}
                    node={node}
                    level={0}
                    onSelect={setSelectedNode}
                    selectedId={selectedNode?.id || null}
                  />
                ))}
              </div>
            </ScrollArea>
          </div>
          
          {/* Right: Node Details */}
          <div className="w-1/2 h-[calc(80vh-120px)]">
            <NodeDetails node={selectedNode} />
          </div>
        </div>
        
        {/* Footer Stats */}
        <div className="px-6 py-3 border-t border-[#2a2a4a] bg-[#0d0d20]">
          <div className="flex items-center gap-6 text-sm">
            <span className="text-muted-foreground">
              Total: <span className="text-foreground">{stats.total}</span> screens
            </span>
            <span className="text-muted-foreground">
              Done: <span className="text-[#00c853]">{stats.done}</span>
            </span>
            <span className="text-muted-foreground">
              In Progress: <span className="text-[#ffd600]">{stats.progress}</span>
            </span>
            <span className="text-muted-foreground">
              Empty: <span className="text-foreground">{stats.empty}</span>
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
