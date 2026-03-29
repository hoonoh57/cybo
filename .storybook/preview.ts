import type { Preview } from "@storybook/react";
import "../src/tokens/tokens.css";
import "../src/tokens/dark.css";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#0f172a' },
      ],
    },
  },
  decorators: [
    (Story) => {
      // Small piece of code to wrap it in a div with data-theme="dark"
      // Alternatively, we could inject this into the story wrapper.
      const theme = 'dark';
      document.body.setAttribute('data-theme', theme);
      return Story();
    },
  ],
};

export default preview;
