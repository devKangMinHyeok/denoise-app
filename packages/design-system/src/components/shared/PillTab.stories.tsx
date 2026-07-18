import type { Meta, StoryObj } from "@storybook/react";
import { PillTab } from "./PillTab";

const meta: Meta<typeof PillTab> = {
  title: "Shared/PillTab",
  component: PillTab,
  args: { children: "All", active: false },
};
export default meta;
type Story = StoryObj<typeof PillTab>;

export const Default: Story = {};
export const Active: Story = { args: { active: true } };
export const Group: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 4 }}>
      <PillTab active>All</PillTab>
      <PillTab>Voice</PillTab>
      <PillTab>Noise</PillTab>
      <PillTab>Pricing</PillTab>
    </div>
  ),
};
