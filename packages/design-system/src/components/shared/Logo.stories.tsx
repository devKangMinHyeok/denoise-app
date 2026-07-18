import type { Meta, StoryObj } from "@storybook/react";
import { Logo } from "./Logo";

const meta: Meta<typeof Logo> = {
  title: "Shared/Logo",
  component: Logo,
  args: { variant: "full", height: 32, animated: false },
  argTypes: {
    variant: { control: "inline-radio", options: ["full", "mark"] },
    height: { control: { type: "range", min: 16, max: 96, step: 4 } },
  },
};
export default meta;
type Story = StoryObj<typeof Logo>;

export const Full: Story = {};
export const Mark: Story = { args: { variant: "mark", height: 48 } };
export const Animated: Story = { args: { animated: true, height: 48 } };
