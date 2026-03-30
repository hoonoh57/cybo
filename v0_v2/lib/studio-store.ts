'use client';

import { create } from 'zustand';
import type { Project, TreeNode, NodeStatus } from './studio-types';

interface StudioState {
  projects: Project[];
  selectedProjectId: string | null;
  selectedNodeId: string | null;
  previewDevice: 'desktop' | 'tablet' | 'mobile';
  isStructureDialogOpen: boolean;
  
  // Actions
  setSelectedProject: (projectId: string) => void;
  setSelectedNode: (nodeId: string) => void;
  toggleProjectExpanded: (projectId: string) => void;
  setPreviewDevice: (device: 'desktop' | 'tablet' | 'mobile') => void;
  setStructureDialogOpen: (open: boolean) => void;
  updateNodeStatus: (nodeId: string, status: NodeStatus) => void;
  updateNodePrompt: (nodeId: string, prompt: string) => void;
  updateNodeCode: (nodeId: string, code: string) => void;
  addChildNode: (parentId: string, name: string) => void;
  deleteNode: (nodeId: string) => void;
  renameNode: (nodeId: string, name: string) => void;
}

// Sample data
const initialProjects: Project[] = [
  {
    id: 'project-1',
    name: 'CYBO Video Editor',
    expanded: true,
    nodes: [
      {
        id: 'node-1',
        name: 'HomeDashboard',
        status: 'done',
        description: 'Main dashboard with project overview',
        code: `export function HomeDashboard() {
  return (
    <div className="p-6">
      <h1>Home Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-card">Hero Cards</div>
        <div className="p-4 rounded-lg bg-card">Tool Grid</div>
        <div className="p-4 rounded-lg bg-card">Recent Projects</div>
      </div>
    </div>
  );
}`,
        filePath: 'components/HomeDashboard.tsx',
        fileSize: 1240,
        lastModified: new Date('2024-03-15'),
        versionCount: 3,
        children: [
          { id: 'node-1-1', name: 'Header', status: 'done', filePath: 'components/Header.tsx', fileSize: 520, lastModified: new Date('2024-03-14'), versionCount: 2 },
          { id: 'node-1-2', name: 'HeroCards', status: 'done', filePath: 'components/HeroCards.tsx', fileSize: 890, lastModified: new Date('2024-03-14'), versionCount: 1 },
          { id: 'node-1-3', name: 'ToolGrid', status: 'done', filePath: 'components/ToolGrid.tsx', fileSize: 1100, lastModified: new Date('2024-03-13'), versionCount: 2 },
          { id: 'node-1-4', name: 'RecentProjects', status: 'done', filePath: 'components/RecentProjects.tsx', fileSize: 780, lastModified: new Date('2024-03-12'), versionCount: 1 },
        ],
      },
      {
        id: 'node-2',
        name: 'Timeline',
        status: 'done',
        description: 'Video editing timeline with tracks',
        code: `export function Timeline() {
  return (
    <div className="flex flex-col h-full">
      <TransportBar />
      <TrackArea />
      <ZoomControls />
    </div>
  );
}`,
        filePath: 'components/Timeline.tsx',
        fileSize: 2450,
        lastModified: new Date('2024-03-16'),
        versionCount: 5,
        children: [
          { 
            id: 'node-2-1', 
            name: 'TransportBar', 
            status: 'done', 
            filePath: 'components/cybo/transport-bar.tsx', 
            fileSize: 9625, 
            lastModified: new Date('2025-03-30'), 
            versionCount: 5,
          },
          { id: 'node-2-2', name: 'TrackArea', status: 'done', filePath: 'components/TrackArea.tsx', fileSize: 3200, lastModified: new Date('2024-03-15'), versionCount: 3 },
          { id: 'node-2-3', name: 'ZoomControls', status: 'done', filePath: 'components/ZoomControls.tsx', fileSize: 680, lastModified: new Date('2024-03-14'), versionCount: 2 },
        ],
      },
      {
        id: 'node-3',
        name: 'Preview',
        status: 'progress',
        description: 'Video preview panel with playback controls',
        prompt: `Create a video preview component with:
- 16:9 aspect ratio video container
- Playback progress bar with scrubbing
- Volume control with mute toggle
- Fullscreen button
- Quality selector dropdown
- Dark theme matching #0d0d20 background`,
        filePath: 'components/Preview.tsx',
        versionCount: 1,
      },
      {
        id: 'node-4',
        name: 'Editor',
        status: 'empty',
        description: 'Main editing workspace',
      },
      {
        id: 'node-5',
        name: 'Settings',
        status: 'empty',
        description: 'Project and app settings',
      },
    ],
  },
  {
    id: 'project-2',
    name: 'Shopping Mall App',
    expanded: false,
    nodes: [
      { id: 'node-6', name: 'Home', status: 'done' },
      { id: 'node-7', name: 'ProductList', status: 'done' },
      { id: 'node-8', name: 'ProductDetail', status: 'progress' },
      { id: 'node-9', name: 'Cart', status: 'empty' },
      { id: 'node-10', name: 'Checkout', status: 'empty' },
    ],
  },
];

function findNodeById(nodes: TreeNode[], nodeId: string): TreeNode | null {
  for (const node of nodes) {
    if (node.id === nodeId) return node;
    if (node.children) {
      const found = findNodeById(node.children, nodeId);
      if (found) return found;
    }
  }
  return null;
}

function updateNodeInTree(nodes: TreeNode[], nodeId: string, updater: (node: TreeNode) => TreeNode): TreeNode[] {
  return nodes.map(node => {
    if (node.id === nodeId) {
      return updater(node);
    }
    if (node.children) {
      return { ...node, children: updateNodeInTree(node.children, nodeId, updater) };
    }
    return node;
  });
}

function deleteNodeFromTree(nodes: TreeNode[], nodeId: string): TreeNode[] {
  return nodes.filter(node => node.id !== nodeId).map(node => {
    if (node.children) {
      return { ...node, children: deleteNodeFromTree(node.children, nodeId) };
    }
    return node;
  });
}

function addChildToNode(nodes: TreeNode[], parentId: string, newNode: TreeNode): TreeNode[] {
  return nodes.map(node => {
    if (node.id === parentId) {
      return { ...node, children: [...(node.children || []), newNode] };
    }
    if (node.children) {
      return { ...node, children: addChildToNode(node.children, parentId, newNode) };
    }
    return node;
  });
}

export const useStudioStore = create<StudioState>((set, get) => ({
  projects: initialProjects,
  selectedProjectId: 'project-1',
  selectedNodeId: 'node-2-1',
  previewDevice: 'desktop',
  isStructureDialogOpen: false,

  setSelectedProject: (projectId) => set({ selectedProjectId: projectId }),
  
  setSelectedNode: (nodeId) => set({ selectedNodeId: nodeId }),
  
  toggleProjectExpanded: (projectId) => set((state) => ({
    projects: state.projects.map(p => 
      p.id === projectId ? { ...p, expanded: !p.expanded } : p
    ),
  })),
  
  setPreviewDevice: (device) => set({ previewDevice: device }),
  
  setStructureDialogOpen: (open) => set({ isStructureDialogOpen: open }),
  
  updateNodeStatus: (nodeId, status) => set((state) => ({
    projects: state.projects.map(project => ({
      ...project,
      nodes: updateNodeInTree(project.nodes, nodeId, (node) => ({ ...node, status })),
    })),
  })),
  
  updateNodePrompt: (nodeId, prompt) => set((state) => ({
    projects: state.projects.map(project => ({
      ...project,
      nodes: updateNodeInTree(project.nodes, nodeId, (node) => ({ 
        ...node, 
        prompt,
        status: prompt ? 'prompt' : node.status,
      })),
    })),
  })),
  
  updateNodeCode: (nodeId, code) => set((state) => ({
    projects: state.projects.map(project => ({
      ...project,
      nodes: updateNodeInTree(project.nodes, nodeId, (node) => ({ 
        ...node, 
        code,
        status: 'done',
        lastModified: new Date(),
        versionCount: (node.versionCount || 0) + 1,
      })),
    })),
  })),
  
  addChildNode: (parentId, name) => {
    const newNode: TreeNode = {
      id: `node-${Date.now()}`,
      name,
      status: 'empty',
    };
    set((state) => ({
      projects: state.projects.map(project => ({
        ...project,
        nodes: addChildToNode(project.nodes, parentId, newNode),
      })),
    }));
  },
  
  deleteNode: (nodeId) => set((state) => ({
    projects: state.projects.map(project => ({
      ...project,
      nodes: deleteNodeFromTree(project.nodes, nodeId),
    })),
    selectedNodeId: state.selectedNodeId === nodeId ? null : state.selectedNodeId,
  })),
  
  renameNode: (nodeId, name) => set((state) => ({
    projects: state.projects.map(project => ({
      ...project,
      nodes: updateNodeInTree(project.nodes, nodeId, (node) => ({ ...node, name })),
    })),
  })),
}));

// Helper to get selected node
export function useSelectedNode(): TreeNode | null {
  const { projects, selectedNodeId } = useStudioStore();
  if (!selectedNodeId) return null;
  
  for (const project of projects) {
    const node = findNodeById(project.nodes, selectedNodeId);
    if (node) return node;
  }
  return null;
}

// Helper to get selected project
export function useSelectedProject(): Project | null {
  const { projects, selectedProjectId } = useStudioStore();
  return projects.find(p => p.id === selectedProjectId) || null;
}

// Helper to get breadcrumb path
export function useNodePath(): string[] {
  const { projects, selectedNodeId, selectedProjectId } = useStudioStore();
  if (!selectedNodeId || !selectedProjectId) return [];
  
  const project = projects.find(p => p.id === selectedProjectId);
  if (!project) return [];
  
  const path: string[] = [project.name];
  
  function findPath(nodes: TreeNode[], targetId: string, currentPath: string[]): string[] | null {
    for (const node of nodes) {
      if (node.id === targetId) {
        return [...currentPath, node.name];
      }
      if (node.children) {
        const found = findPath(node.children, targetId, [...currentPath, node.name]);
        if (found) return found;
      }
    }
    return null;
  }
  
  const nodePath = findPath(project.nodes, selectedNodeId, []);
  return nodePath ? [project.name, ...nodePath] : path;
}

// Helper to count stats
export function useProjectStats(): { total: number; done: number; progress: number; empty: number } {
  const project = useSelectedProject();
  if (!project) return { total: 0, done: 0, progress: 0, empty: 0 };
  
  let total = 0, done = 0, progress = 0, empty = 0;
  
  function countNodes(nodes: TreeNode[]) {
    for (const node of nodes) {
      total++;
      if (node.status === 'done') done++;
      else if (node.status === 'progress') progress++;
      else if (node.status === 'empty' || node.status === 'prompt') empty++;
      if (node.children) countNodes(node.children);
    }
  }
  
  countNodes(project.nodes);
  return { total, done, progress, empty };
}
