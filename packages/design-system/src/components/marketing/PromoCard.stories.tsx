import type { Meta, StoryObj } from "@storybook/react";
import { PromoCard } from "./PromoCard";

const meta: Meta<typeof PromoCard> = {
  title: "Marketing/PromoCard",
  component: PromoCard,
  args: { tone: "blue", title: "Follow along on X", children: "Product news, release notes and voice demos." },
  argTypes: { tone: { control: "inline-radio", options: ["blue", "violet", "slate"] } },
};
export default meta;
type Story = StoryObj<typeof PromoCard>;

export const Blue: Story = { render: (a) => <div style={{ width: 420 }}><PromoCard {...a} /></div> };
export const Pair: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 320px)", gap: 20 }}>
      <PromoCard tone="blue" title="Follow on X">Release notes and demos.</PromoCard>
      <PromoCard tone="violet" title="Join the community">Ask, share and shape the roadmap.</PromoCard>
    </div>
  ),
};
