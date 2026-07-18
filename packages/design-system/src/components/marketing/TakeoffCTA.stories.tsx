import type { Meta, StoryObj } from "@storybook/react";
import { TakeoffCTA } from "./TakeoffCTA";

const meta: Meta<typeof TakeoffCTA> = {
  title: "Marketing/TakeoffCTA",
  component: TakeoffCTA,
  parameters: { layout: "fullscreen" },
  args: {
    title: "Ready for take-off?",
    subtitle: "Download Timbre and let your own voice read the script.",
    cta: "Download for Mac",
    command: "brew install --cask timbre",
    note: "macOS 12+",
  },
};
export default meta;
type Story = StoryObj<typeof TakeoffCTA>;

export const Default: Story = {};
