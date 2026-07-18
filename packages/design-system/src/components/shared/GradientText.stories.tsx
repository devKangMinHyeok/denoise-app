import type { Meta, StoryObj } from "@storybook/react";
import { GradientText } from "./GradientText";

const meta: Meta<typeof GradientText> = {
  title: "Shared/GradientText",
  component: GradientText,
  args: { children: "your voice", variant: "gradient" },
  argTypes: { variant: { control: "inline-radio", options: ["gradient", "pill", "plain"] } },
};
export default meta;
type Story = StoryObj<typeof GradientText>;

export const Gradient: Story = {
  render: (a) => (
    <span style={{ font: "500 40px/1.1 var(--rc-font-sans)", color: "var(--rc-ink)" }}>
      Read scripts in <GradientText {...a} />
    </span>
  ),
};
export const Pill: Story = { args: { variant: "pill", children: "New" } };
export const Plain: Story = {
  args: { variant: "plain", children: "emphasis" },
  render: (a) => (
    <span style={{ font: "400 20px/1.5 var(--rc-font-sans)", color: "var(--rc-body)" }}>
      Some <GradientText {...a} /> here
    </span>
  ),
};
