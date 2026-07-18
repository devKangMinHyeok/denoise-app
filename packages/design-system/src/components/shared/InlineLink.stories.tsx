import type { Meta, StoryObj } from "@storybook/react";
import { InlineLink } from "./InlineLink";

const meta: Meta<typeof InlineLink> = {
  title: "Shared/InlineLink",
  component: InlineLink,
  args: { children: "read the docs", href: "#" },
};
export default meta;
type Story = StoryObj<typeof InlineLink>;

export const Default: Story = {
  render: (a) => (
    <p style={{ font: "400 16px/1.7 var(--rc-font-sans)", color: "var(--rc-body)", maxWidth: 420 }}>
      Everything runs on your Mac, <InlineLink {...a} /> to see how the engine stays offline.
    </p>
  ),
};
