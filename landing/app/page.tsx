import { Nav } from "./_sections/Nav";
import { Hero } from "./_sections/Hero";
import { Problem } from "./_sections/Problem";
import { Features } from "./_sections/Features";
import { Quality } from "./_sections/Quality";
import { LocalFirst } from "./_sections/LocalFirst";
import { Mcp } from "./_sections/Mcp";
import { Pricing } from "./_sections/Pricing";
import { Faq } from "./_sections/Faq";
import { FinalCta } from "./_sections/FinalCta";
import { Footer } from "./_sections/Footer";

// Single-route Vocast landing, composed from section components built on the
// Timbre design system (tokens + primitives). Almost entirely static; only Nav,
// HeroPlayer, KaraokeDemo and Faq are client components.
export default function Page() {
  return (
    <main>
      <Nav />
      <Hero />
      <Problem />
      <Features />
      <Quality />
      <LocalFirst />
      <Mcp />
      <Pricing />
      <Faq />
      <FinalCta />
      <Footer />
    </main>
  );
}
