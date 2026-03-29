# Design Tokens System

Follow this structure for design tokens:

## Configuration Files
- `src/tokens/tokens.css`: Core design tokens (colors, sizes, typography).
- `src/tokens/dark.css`: Dark mode variable overrides.

## Token Naming Convention
- `--color-[name]-[value]`: Use value for shades (e.g. `--color-blue-500`).
- `--spacing-[name]`: Use semantic names (e.g. `--spacing-sm`).
- `--font-size-[name]`: Use standard names (e.g. `--font-size-base`).
- `--radius-[name]`: Use standard names (e.g. `--radius-md`).

## Theming
- Root variables are defined in `tokens.css`.
- Dark mode overrides are applied using the `[data-theme="dark"]` selector in `dark.css`.

## Usage
- Always prefer tokens over raw values.
- In CSS Modules: `color: var(--color-text-primary);`.
- In TypeScript: Use `LAYOUT_CONSTANTS` in `src/tokens/layout.constants.ts` for pixel values in JS/TS.
