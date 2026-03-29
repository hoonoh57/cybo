export interface BaseBlockProps {
  id?: string;
  className?: string;
  style?: React.CSSProperties;
}

export type BlockHierarchy = 'atom' | 'molecule' | 'organism' | 'template';

export interface BlockMetadata {
  name: string;
  hierarchy: BlockHierarchy;
  description?: string;
}
