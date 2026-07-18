import type { Preview } from "@storybook/react";
// Global tokens + fonts + body defaults (dark-only canvas).
import "../src/styles.css";

const preview: Preview = {
  parameters: {
    layout: "centered",
    backgrounds: { disable: true }, // canvas comes from --rc-canvas on <body>
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    options: {
      storySort: {
        order: ["Foundations", ["Tokens"], "Shared", "Marketing"],
      },
    },
  },
};

export default preview;
