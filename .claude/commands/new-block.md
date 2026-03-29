---
description: Create a new UI block component with its associated files.
---

# Command: /new-block [name]

When this command is run:

1. Identify the block's hierarchy (atom, molecule, organism, or template).
2. Create a folder in `src/blocks/[hierarchy]/[name]`.
3. Create standard files:
   - `[name].tsx`
   - `[name].module.css`
   - `[name].stories.tsx`
   - `[name].puck.ts`
4. Register the new block in `src/puck/config.ts`.
5. Update `CLAUDE.md` if needed.
6. Provide a code summary.
