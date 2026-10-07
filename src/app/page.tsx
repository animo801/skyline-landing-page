import FunnelTracker from "@/components/FunnelTracker";
import Hero from "@/components/Hero";
import { FUNNEL_EVENTS } from "@/lib/funnel";

export default function Home() {
  return (
    <main>
      <FunnelTracker
        landedEvent={FUNNEL_EVENTS.landed}
        ctaClickEvent={FUNNEL_EVENTS.ctaClick}
      />
      <Hero />
    </main>
  );
}
