export type NodeStatus = 'empty' | 'prompt' | 'progress' | 'done';

export interface TreeNode {
  id: string;
  name: string;
  status: NodeStatus;
  description?: string;
  prompt?: string;
  code?: string;
  filePath?: string;
  fileSize?: number;
  lastModified?: Date;
  versionCount?: number;
  children?: TreeNode[];
}

export interface Project {
  id: string;
  name: string;
  expanded: boolean;
  nodes: TreeNode[];
}

export const screenTypes = [
  'Dashboard',
  'Timeline',
  'Preview',
  'Form',
  'List',
  'Detail',
  'Custom',
] as const;

export type ScreenType = typeof screenTypes[number];
