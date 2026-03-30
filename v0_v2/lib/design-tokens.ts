/**
 * CYBO Design System — Design Tokens
 * 모든 컴포넌트가 이 토큰을 참조하여 일관된 아이덴티티를 유지합니다.
 */

// ─── 브랜드 컬러 ───
export const BRAND = {
  primary: '#6c63ff',       // CYBO 시그니처 퍼플
  primaryHover: '#5b52ee',
  primaryMuted: 'rgba(108,99,255,0.15)',
  primaryGlow: 'rgba(108,99,255,0.3)',
  secondary: '#a855f7',    // 보조 퍼플
  accent: '#00c853',       // 성공/활성
  warning: '#ffd600',
  danger: '#ff5252',
  info: '#448aff',
} as const;

// ─── 배경 계층 (깊이별) ───
export const BG = {
  base: '#08081a',         // 최하단 (앱 배경)
  surface: '#0a0a1c',      // 패널 배경
  elevated: '#0c0c20',     // 카드/섹션
  overlay: '#10102a',      // 모달/드롭다운
  input: '#0a0a1e',        // 입력 필드
  track: '#12122a',        // 타임라인 트랙 배경
  clip: '#1a1a3a',         // 클립/블록 기본
} as const;

// ─── 보더 ───
export const BORDER = {
  subtle: 'rgba(255,255,255,0.06)',
  default: '#1a1a30',
  hover: 'rgba(255,255,255,0.10)',
  active: '#2a2a4a',
  focus: '#6c63ff',
} as const;

// ─── 텍스트 계층 ───
export const TEXT = {
  primary: '#e0e0f0',      // 본문
  secondary: '#b0b0c8',    // 보조 정보
  tertiary: '#808098',     // 비활성/힌트
  muted: '#505070',        // 라벨/캡션
  disabled: '#303050',     // 비활성
  inverse: '#ffffff',      // 밝은 배경 위 텍스트
} as const;

// ─── 트랙 타입별 컬러 ───
export const TRACK_COLORS = {
  video: {
    primary: '#448aff',
    bg: 'rgba(68,138,255,0.15)',
    border: 'rgba(68,138,255,0.3)',
    glow: 'rgba(68,138,255,0.2)',
  },
  audio: {
    primary: '#00c853',
    bg: 'rgba(0,200,83,0.15)',
    border: 'rgba(0,200,83,0.3)',
    glow: 'rgba(0,200,83,0.2)',
  },
  subtitle: {
    primary: '#a855f7',
    bg: 'rgba(168,85,247,0.15)',
    border: 'rgba(168,85,247,0.3)',
    glow: 'rgba(168,85,247,0.2)',
  },
  effect: {
    primary: '#ff9800',
    bg: 'rgba(255,152,0,0.15)',
    border: 'rgba(255,152,0,0.3)',
    glow: 'rgba(255,152,0,0.2)',
  },
  overlay: {
    primary: '#cd853f',
    bg: 'rgba(205,133,63,0.15)',
    border: 'rgba(205,133,63,0.3)',
    glow: 'rgba(205,133,63,0.2)',
  },
  music: {
    primary: '#1e90ff',
    bg: 'rgba(30,144,255,0.15)',
    border: 'rgba(30,144,255,0.3)',
    glow: 'rgba(30,144,255,0.2)',
  },
} as const;

export type TrackType = keyof typeof TRACK_COLORS;

// ─── 타이포그래피 ───
export const TYPO = {
  fontFamily: {
    sans: "'Inter', -apple-system, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },
  size: {
    xs: '10px',
    sm: '11px',
    base: '12px',
    md: '13px',
    lg: '14px',
    xl: '16px',
    '2xl': '18px',
  },
  weight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const;

// ─── 간격 ───
export const SPACING = {
  xs: '2px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '24px',
  '3xl': '32px',
} as const;

// ─── 라운딩 ───
export const RADIUS = {
  sm: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  full: '9999px',
} as const;

// ─── 애니메이션 ───
export const MOTION = {
  fast: '100ms ease-out',
  default: '200ms ease-out',
  smooth: '300ms cubic-bezier(0.4,0,0.2,1)',
} as const;

// ─── z-index 계층 ───
export const Z = {
  track: 1,
  clip: 10,
  playhead: 20,
  toolbar: 30,
  dropdown: 40,
  modal: 50,
  toast: 60,
} as const;
