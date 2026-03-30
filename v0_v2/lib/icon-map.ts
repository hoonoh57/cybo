/**
 * CYBO Icon System — Lucide 아이콘 매핑
 * 이모지 대신 일관된 SVG 아이콘을 사용합니다.
 * 모든 컴포넌트는 이 맵을 통해 아이콘을 참조합니다.
 */
import {
  // 트랙 타입
  Video,
  Music,
  AudioLines,
  Captions,
  Layers,
  Sparkles,
  ImagePlus,
  Mic,
  
  // 트랙 컨트롤
  Volume2,
  VolumeX,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Headphones,
  
  // 편집 도구
  Scissors,
  Trash2,
  Copy,
  ClipboardPaste,
  Undo2,
  Redo2,
  Magnet,
  RulerDimensionLine,
  
  // 트랜스포트
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ChevronsLeft,
  ChevronsRight,
  Repeat,
  
  // 줌/네비
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Move,
  
  // 상태/정보
  Plus,
  Minus,
  ChevronDown,
  ChevronRight,
  GripVertical,
  MoreHorizontal,
  Settings,
  Wand2,
  
  // 파일/프로젝트
  FolderOpen,
  FileVideo,
  FileAudio,
  FileImage,
  FileText,
  Download,
  Upload,
  
  type LucideIcon,
} from 'lucide-react';

// ─── 트랙 타입 → 아이콘 매핑 ───
export const TRACK_ICONS: Record<string, LucideIcon> = {
  video: Video,
  audio: AudioLines,
  music: Music,
  subtitle: Captions,
  effect: Sparkles,
  overlay: Layers,
  voiceover: Mic,
  image: ImagePlus,
} as const;

// ─── 트랙 컨트롤 아이콘 ───
export const CONTROL_ICONS = {
  mute: VolumeX,
  unmute: Volume2,
  solo: Headphones,
  lock: Lock,
  unlock: Unlock,
  visible: Eye,
  hidden: EyeOff,
} as const;

// ─── 편집 도구 아이콘 ───
export const TOOL_ICONS = {
  cut: Scissors,
  delete: Trash2,
  copy: Copy,
  paste: ClipboardPaste,
  undo: Undo2,
  redo: Redo2,
  snap: Magnet,
  ripple: RulerDimensionLine,
  ai: Wand2,
} as const;

// ─── 트랜스포트 아이콘 ───
export const TRANSPORT_ICONS = {
  play: Play,
  pause: Pause,
  skipBack: SkipBack,
  skipForward: SkipForward,
  goToStart: ChevronsLeft,
  goToEnd: ChevronsRight,
  loop: Repeat,
  speedDown: ChevronDown,
} as const;

// ─── 줌/네비게이션 아이콘 ───
export const NAV_ICONS = {
  zoomIn: ZoomIn,
  zoomOut: ZoomOut,
  fullscreen: Maximize2,
  exitFullscreen: Minimize2,
  move: Move,
  grip: GripVertical,
  more: MoreHorizontal,
} as const;

// ─── 파일 타입 → 아이콘 매핑 ───
export const FILE_ICONS: Record<string, LucideIcon> = {
  video: FileVideo,
  audio: FileAudio,
  image: FileImage,
  text: FileText,
  folder: FolderOpen,
} as const;

// ─── 범용 아이콘 ───
export const UI_ICONS = {
  add: Plus,
  remove: Minus,
  settings: Settings,
  download: Download,
  upload: Upload,
  expand: ChevronRight,
  collapse: ChevronDown,
} as const;
