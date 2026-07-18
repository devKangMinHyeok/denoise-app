import type { Meta, StoryObj } from "@storybook/react";
import { SectionHeading } from "./SectionHeading";

const meta: Meta<typeof SectionHeading> = {
  title: "Marketing/SectionHeading",
  component: SectionHeading,
  args: {
    eyebrow: "FEATURES",
    title: "From script to narration,",
    accent: "in one app",
    subtitle: "Every screen here is what you actually see in the app.",
    align: "center",
    size: 40,
  },
  argTypes: { align: { control: "inline-radio", options: ["center", "left"] } },
};
export default meta;
type Story = StoryObj<typeof SectionHeading>;

export const Centered: Story = {};
export const Left: Story = { args: { align: "left" } };
