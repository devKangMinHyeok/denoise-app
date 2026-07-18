import type { Meta, StoryObj } from "@storybook/react";
import { InstallCommand } from "./InstallCommand";

const meta: Meta<typeof InstallCommand> = {
  title: "Shared/InstallCommand",
  component: InstallCommand,
  args: { command: "brew install --cask timbre" },
};
export default meta;
type Story = StoryObj<typeof InstallCommand>;

export const Default: Story = {};
