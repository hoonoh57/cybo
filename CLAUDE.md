# CYBO — CYber Building Operations

## 프로젝트 목적
AI-Studio v2의 UI를 레고처럼 조립·해체·검증하는 사이버 건축 환경.
이 프로젝트는 버리지 않는다. 버전업하며 제품과 함께 진화한다.

## 기술 스택
- React 19 + TypeScript 5.5+ (Vite 6)
- CSS Modules + tokens.css (커스텀 프로퍼티)
- Storybook 8 (Lab 모드)
- Puck Editor (Build 모드)

## 3가지 실행 모드
- `npm run lab`     → Storybook (포트 6006)
- `npm run build`   → Puck 드래그앤드롭 에디터 (포트 5173)
- `npm run preview` → 통합 앱 미리보기 (포트 5173)

## 코딩 규칙 (비타협)
- 파일 ≤ 300줄, 컴포넌트 ≤ 200줄
- named export만 (default export 금지)
- CSS Modules만 (인라인 스타일, Tailwind 금지)
- tokens.css 변수만 사용 (하드코딩 색상/크기 금지)
- 블록 삼위일체: .tsx + .module.css + .stories.tsx + .puck.ts

## 디렉토리 규칙
- 블록은 src/blocks/{atoms|molecules|organisms|templates}/ 아래에만
- 각 블록은 독립 폴더 (Button/Button.tsx, Button/Button.module.css ...)
- 비즈니스 로직 없음 — 순수 UI 껍데기만

## v0.dev 코드 반입 규칙
1. v0 생성 코드를 받으면 Tailwind 클래스 → CSS Module로 변환
2. shadcn/ui 컴포넌트 → 자체 atoms 블록으로 교체
3. 하드코딩 색상 → tokens.css 변수로 교체
4. default export → named export
5. 파일 분리 (300줄 초과 시)
