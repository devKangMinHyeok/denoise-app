import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./Badge";

const meta: Meta<typeof Badge> = {
  title: "Shared/Badge",
  component: Badge,
  args: { children: "Pro", variant: "pro" },
  argTypes: { variant: { control: "inline-radio", options: ["pro", "info"] } },
};
export default meta;
type Story = StoryObj<typeof Badge>;

export const Pro: Story = {};
export const Info: Story = { args: { variant: "info", children: "New" } };
export const Row: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8 }}>
      <Badge variant="pro">Pro</Badge>
      <Badge variant="info">Beta</Badge>
    </div>
  ),
};
