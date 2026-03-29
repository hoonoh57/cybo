# Converting v0 Code to CYBO Standards

Follow these steps to convert v0 code to CYBO:

1. **Extract Blocks:** Identify functional blocks in the v0 code and map them to Atos, Molecules, Organisms, or Templates.
2. **De-Tailwind:** Convert Tailwind classes to CSS variables from `tokens.css`.
3. **TypeScript:** Add explicit types for all props and state.
4. **CSS Modules:** Extract styles to `.module.css` files.
5. **Puck Registration:** Create a corresponding `.puck.ts` configuration.
6. **Icons:** Use the generic `Icon` component for all iconography.
7. **Refactor:** If a component is over 300 lines, break it down further.
8. **Export:** Ensure components are exported properly for use in the Puck editor.
