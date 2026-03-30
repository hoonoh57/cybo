'use client';

import { useState } from 'react';
import { 
  ChevronRight, 
  ChevronDown, 
  Plus, 
  FolderOpen,
  Layout,
  Play,
  Monitor,
  Clock,
  Sliders,
  Home,
  ShoppingBag,
  List,
  ShoppingCart,
  CreditCard,
  Layers,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { useStudioStore, useProjectStats } from '@/lib/studio-store';
import type { TreeNode, Project, NodeStatus } from '@/lib/studio-types';
import { cn } from '@/lib/utils';

function StatusDot({ status }: { status: NodeStatus }) {
  return (
    <span 
      className={cn(
        'w-1.5 h-1.5 rounded-full shrink-0',
        status === 'done' && 'bg-[#00c853] status-glow-done',
        status === 'progress' && 'bg-[#ffd600]',
        status === 'prompt' && 'bg-[#448aff]',
        status === 'empty' && 'bg-[#333350]'
      )}
    />
  );
}

function getNodeIcon(name: string) {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('home') || lowerName.includes('dashboard')) return Home;
  if (lowerName.includes('timeline') || lowerName.includes('track')) return Clock;
  if (lowerName.includes('preview') || lowerName.includes('player')) return Monitor;
  if (lowerName.includes('settings') || lowerName.includes('control')) return Sliders;
  if (lowerName.includes('product')) return ShoppingBag;
  if (lowerName.includes('list')) return List;
  if (lowerName.includes('cart')) return ShoppingCart;
  if (lowerName.includes('checkout')) return CreditCard;
  if (lowerName.includes('transport') || lowerName.includes('zoom')) return Layers;
  return Layout;
}

interface TreeNodeItemProps {
  node: TreeNode;
  level: number;
  projectId: string;
  isLast?: boolean;
  parentLines?: boolean[];
}

function TreeNodeItem({ node, level, projectId, isLast = false, parentLines = [] }: TreeNodeItemProps) {
  const [expanded, setExpanded] = useState(true);
  const { selectedNodeId, setSelectedNode, addChildNode, deleteNode, renameNode, updateNodeStatus } = useStudioStore();
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedNodeId === node.id;
  const Icon = getNodeIcon(node.name);

  return (
    <div className="relative">
      {/* Vertical guide lines */}
      {parentLines.map((showLine, idx) => (
        showLine && (
          <div 
            key={idx}
            className="absolute top-0 bottom-0 w-px bg-[#1a1a30]"
            style={{ left: `${idx * 20 + 16}px` }}
          />
        )
      ))}
      
      {/* Horizontal connector line */}
      {level > 0 && (
        <div 
          className="absolute w-3 h-px bg-[#1a1a30]"
          style={{ 
            left: `${(level - 1) * 20 + 16}px`,
            top: '16px'
          }}
        />
      )}
      
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div
            onClick={() => setSelectedNode(node.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setSelectedNode(node.id);
              }
            }}
            className={cn(
              'relative flex items-center gap-2 h-8 text-[13px] transition-smooth cursor-pointer group',
              'hover:bg-white/[0.03]',
              isSelected && 'bg-[rgba(108,99,255,0.1)]'
            )}
            style={{ paddingLeft: `${level * 20 + 16}px`, paddingRight: '16px' }}
          >
            {/* Left accent border for selected node */}
            {isSelected && (
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#6c63ff]" />
            )}
            
            {/* Expand/Collapse arrow */}
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
                className="w-3.5 h-3.5 flex items-center justify-center shrink-0 cursor-pointer"
              >
                {expanded ? (
                  <ChevronDown className="w-3 h-3 text-[#505070]" />
                ) : (
                  <ChevronRight className="w-3 h-3 text-[#505070]" />
                )}
              </span>
            ) : (
              <span className="w-3.5 shrink-0" />
            )}
            
            {/* Icon */}
            <Icon className={cn(
              'w-3.5 h-3.5 shrink-0 transition-smooth',
              isSelected ? 'text-[#6c63ff]' : 'text-[#505070]'
            )} />
            
            {/* Name */}
            <span className={cn(
              'flex-1 truncate transition-smooth',
              isSelected ? 'text-white font-semibold' : 'text-[#b0b0c8] font-medium'
            )}>
              {node.name}
            </span>
            
            {/* Status dot */}
            <StatusDot status={node.status} />
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="bg-[#12122a] border-[rgba(255,255,255,0.06)] floating-element">
          <ContextMenuItem 
            onClick={() => {
              const name = prompt('Enter child screen name:');
              if (name) addChildNode(node.id, name);
            }}
            className="text-[#b0b0c8] text-[12px] hover:bg-white/[0.05] focus:bg-white/[0.05] hover:text-white focus:text-white"
          >
            Add Child Screen
          </ContextMenuItem>
          <ContextMenuItem 
            onClick={() => {
              const name = prompt('Enter new name:', node.name);
              if (name) renameNode(node.id, name);
            }}
            className="text-[#b0b0c8] text-[12px] hover:bg-white/[0.05] focus:bg-white/[0.05] hover:text-white focus:text-white"
          >
            Edit
          </ContextMenuItem>
          <ContextMenuItem 
            onClick={() => deleteNode(node.id)}
            className="text-[#ef4444] text-[12px] hover:bg-[#ef4444]/10 focus:bg-[#ef4444]/10"
          >
            Delete
          </ContextMenuItem>
          <ContextMenuSeparator className="bg-[rgba(255,255,255,0.06)]" />
          <ContextMenuItem 
            onClick={() => updateNodeStatus(node.id, 'empty')}
            className="text-[#b0b0c8] text-[12px] hover:bg-white/[0.05] focus:bg-white/[0.05] hover:text-white focus:text-white"
          >
            Set Empty
          </ContextMenuItem>
          <ContextMenuItem 
            onClick={() => updateNodeStatus(node.id, 'prompt')}
            className="text-[#b0b0c8] text-[12px] hover:bg-white/[0.05] focus:bg-white/[0.05] hover:text-white focus:text-white"
          >
            Generate Prompt
          </ContextMenuItem>
          <ContextMenuItem 
            onClick={() => updateNodeStatus(node.id, 'progress')}
            className="text-[#b0b0c8] text-[12px] hover:bg-white/[0.05] focus:bg-white/[0.05] hover:text-white focus:text-white"
          >
            Set In Progress
          </ContextMenuItem>
          <ContextMenuItem 
            onClick={() => updateNodeStatus(node.id, 'done')}
            className="text-[#b0b0c8] text-[12px] hover:bg-white/[0.05] focus:bg-white/[0.05] hover:text-white focus:text-white"
          >
            Mark Complete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      
      {hasChildren && expanded && (
        <div>
          {node.children!.map((child, idx) => (
            <TreeNodeItem
              key={child.id}
              node={child}
              level={level + 1}
              projectId={projectId}
              isLast={idx === node.children!.length - 1}
              parentLines={[...parentLines, !isLast]}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface ProjectItemProps {
  project: Project;
}

function ProjectItem({ project }: ProjectItemProps) {
  const { toggleProjectExpanded, setSelectedProject, selectedProjectId } = useStudioStore();
  const isSelected = selectedProjectId === project.id;
  
  return (
    <div className="mb-1">
      <button
        onClick={() => {
          toggleProjectExpanded(project.id);
          setSelectedProject(project.id);
        }}
        className={cn(
          'w-full flex items-center gap-2 px-4 h-8 text-[13px] font-semibold transition-smooth',
          'hover:bg-white/[0.03]',
          isSelected && 'text-white'
        )}
      >
        {project.expanded ? (
          <ChevronDown className="w-3 h-3 text-[#505070] shrink-0" />
        ) : (
          <ChevronRight className="w-3 h-3 text-[#505070] shrink-0" />
        )}
        <FolderOpen className={cn(
          'w-4 h-4 shrink-0 transition-smooth',
          project.expanded ? 'text-[#6c63ff]' : 'text-[#606080]'
        )} />
        <span className={cn(
          'flex-1 text-left truncate',
          project.expanded ? 'text-white' : 'text-[#b0b0c8]'
        )}>
          {project.name}
        </span>
      </button>
      
      {project.expanded && (
        <div className="mt-0.5">
          {project.nodes.map((node, idx) => (
            <TreeNodeItem
              key={node.id}
              node={node}
              level={1}
              projectId={project.id}
              isLast={idx === project.nodes.length - 1}
              parentLines={[]}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function LeftPanel() {
  const { projects, setStructureDialogOpen } = useStudioStore();
  const stats = useProjectStats();
  
  return (
    <div className="w-[260px] h-full flex flex-col bg-[#0c0c1e] panel-depth">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-12 border-b border-[#1a1a30]">
        <span className="text-[15px] font-semibold text-white">CYBO Studio</span>
        <button
          className="w-7 h-7 rounded-md border border-[rgba(255,255,255,0.08)] flex items-center justify-center transition-smooth hover:bg-white/[0.05]"
          title="New Project"
        >
          <Plus className="w-4 h-4 text-[#606080]" />
        </button>
      </div>
      
      {/* Section Label */}
      <div className="px-4 pt-4 pb-2">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-[#505070]">
          PROJECTS
        </span>
      </div>
      
      {/* Project Tree */}
      <ScrollArea className="flex-1">
        {projects.map((project) => (
          <ProjectItem key={project.id} project={project} />
        ))}
      </ScrollArea>
      
      {/* Footer */}
      <div className="border-t border-[#1a1a30]">
        <button
          onClick={() => setStructureDialogOpen(true)}
          className="w-full h-10 flex items-center justify-center text-[10px] font-semibold uppercase tracking-widest text-[#505070] transition-smooth hover:bg-white/[0.03] hover:text-[#707090]"
        >
          Project Map
        </button>
      </div>
    </div>
  );
}
