import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-essentials"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  core: { disableTelemetry: true },
  // GitHub Pages serves Storybook under /vocast/storybook/ (see .github/workflows/pages.yml).
  // Vite base is set at build time via the STORYBOOK_BASE env; falls back to "/" for local dev.
  viteFinal: async (cfg) => {
    cfg.base = process.env.STORYBOOK_BASE || "/";
    return cfg;
  },
};

export default config;
