---
description: Import code from v0 and convert it into the CYBO block system.
---

# Command: /import-v0 [code]

When this command is run:

1. Analyze and extract the logic and styles from the v0 code.
2. Break it down into Atoms, Molecules, and Organisms if it's a large block.
3. Replace Tailwind classes with design tokens from `tokens.css`.
4. Generate CSS Modules for the styles.
5. Setup TypeScript props and component signatures.
6. Create the project structure for the new block(s).
7. Create a Storybook file and a Puck config file.
8. Register in `src/puck/config.ts`.
