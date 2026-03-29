export type Orientation = 'horizontal' | 'vertical';

export interface PanelConfig {
  id: string;
  title: string;
  isCollapsed?: boolean;
  width?: number | string;
  height?: number | string;
}

export type Theme = 'light' | 'dark';
