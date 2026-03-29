export interface EditorState {
  isPlaying: boolean;
  currentTime: number;
  zoonLevel: number;
  selectedClipId?: string;
}

export interface MediaClip {
  id: string;
  type: 'video' | 'audio' | 'image' | 'text';
  startTime: number;
  duration: number;
  src?: string;
  metadata?: any;
}
