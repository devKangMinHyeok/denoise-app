import type { Meta, StoryObj } from "@storybook/react";
import { FeatureCard } from "./FeatureCard";
import { InlineLink } from "../shared/InlineLink";

const meta: Meta<typeof FeatureCard> = {
  title: "Marketing/FeatureCard",
  component: FeatureCard,
  args: {
    title: "Voice cloning, on-device",
    children: "Paste a script and hear it in your own voice, intonation, breath and emphasis intact.",
  },
};
export default meta;
type Story = StoryObj<typeof FeatureCard>;

export const Default: Story = { render: (a) => <div style={{ width: 360 }}><FeatureCard {...a} /></div> };
export const Elevated: Story = { args: { elevated: true }, render: (a) => <div style={{ width: 360 }}><FeatureCard {...a} /></div> };
export const WithFooter: Story = {
  render: (a) => (
    <div style={{ width: 360 }}>
      <FeatureCard {...a} footer={<InlineLink href="#">Learn more</InlineLink>} />
    </div>
  ),
};
export const Grid: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 300px)", gap: 20 }}>
      <FeatureCard title="Noise removal" >Keep the word endings; kill only the silence.</FeatureCard>
      <FeatureCard elevated title="Long-form" >20,000-character scripts, regenerated paragraph by paragraph.</FeatureCard>
    </div>
  ),
};
