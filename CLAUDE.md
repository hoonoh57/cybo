# CYBO Project Context

## Project Overview
CYBO is a professional AI video editor built with a modular "Block" architecture. It uses a custom design system and integrates Puck for visual editing.

## Tech Stack
- **Framework:** React + Vite + TypeScript
- **State Management:** (TBD - likely Zustand or Context API)
- **Styling:** CSS Modules with Design Tokens (Vanilla CSS)
- **Builder:** @puckjs/core
- **Tools:** Storybook for component development

## Block Architecture
Components are organized into a strict hierarchy:
1. **Atoms:** Smallest UI elements (Button, Icon, Badge).
2. **Molecules:** Combinations of atoms (TabItem, PanelHeader).
3. **Organisms:** Functionally complete sections (Timeline, LeftPanel).
4. **Templates:** Page-level layouts (EditorShell, HomeDashboard).

## Development Rules
- **Lines of Code:** Keep components under 300 lines.
- **Styling:** Use CSS Modules (`Component.module.css`).
- **Tokens:** Always use variables from `tokens.css`.
- **Puck:** Every block should have a corresponding `.puck.ts` configuration.
- **Storybook:** Every block should have a `.stories.tsx` file.

## Commands
- `/new-block [name]` - Generate a new component with Story and Puck setup.
- `/import-v0 [code]` - Convert v0 generated code to CYBO standards.
- `/benchmark [product]` - Analyze competitor UI and document in `docs/benchmarks`.
