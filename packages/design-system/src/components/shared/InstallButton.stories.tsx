import type { Meta, StoryObj } from "@storybook/react";
import { InstallButton } from "./InstallButton";

const meta: Meta<typeof InstallButton> = {
  title: "Shared/InstallButton",
  component: InstallButton,
  args: { children: "Install Extension" },
};
export default meta;
type Story = StoryObj<typeof InstallButton>;

export const Default: Story = {};
