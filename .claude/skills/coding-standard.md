# Coding Standards

Follow these rules for all code in the CYBO project:

## Component Structure
- Use Functional Components with TypeScript.
- Maximum 300 lines of code per file (enforced).
- Use `export const ComponentName = ...`.
- Separate logic from UI where appropriate (custom hooks).

## Styling
- Use **CSS Modules** (`ComponentName.module.css`).
- Use **Design Tokens** for everything (colors, spacing, typography).
- Avoid inline styles or ad-hoc Tailwind classes (unless requested).
- Use CSS variables from `tokens.css`.

## Directory Standard
- Create a folder for each component if it has more than just a `.tsx` file.
- `ComponentName/`
  - `ComponentName.tsx`
  - `ComponentName.module.css`
  - `ComponentName.stories.tsx`                  # Storybook
  - `ComponentName.puck.ts`                     # Puck config
  - `index.ts`                                    # Export

## Imports
- Use Absolute imports starting from `src/`.
- Organize imports: React, External libs, Internal components, Types, CSS.
