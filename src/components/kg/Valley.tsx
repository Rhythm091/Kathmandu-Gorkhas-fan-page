import { useState } from "react";
import { SectionHead, Reveal } from "./primitives";
import { useWarrior } from "@/lib/warrior";
import { cn } from "@/lib/utils";

const CITIES = [
  { id: "ktm", name: "Kathmandu", deva: "काठमाडौं", tag: "The Capital Heart", x: 44, y: 42, body: "The pulse of the Valley. Durbar Square, Asan's crowded lanes and a city that never stops talking cricket.", fact: "Home of the roar" },
  { id: "ltp", name: "Lalitpur", deva: "ललितपुर", tag: "The City of Fine Arts", x: 46, y: 62, body: "Patan's craftsmen carved gods from wood and metal. Precision and patience — a craftsman's way of playing the game.", fact: "Craft. Precision." },
  { id: "bkt", name: "Bhaktapur", deva: "भक्तपुर", tag: "The City of Devotees", x: 74, y: 52, body: "Five-storey Nyatapola stands unshaken through centuries. Steady, devoted, unbreakable — the Gorkha temperament.", fact: "Built to endure" },
  { id: "nwk", name: "Nuwakot", deva: "नुवाकोट", tag: "The Hilltop Gateway", x: 22, y: 18, body: "The old fortress on the ridge where the story of unification began. The Valley's horizon — and its wider family.", fact: "Where it began" },
];

export function Valley() {
  const [active, setActive] = useState(0);
  const { complete } = useWarrior();
  const c = CITIES[active];
  const pick = (i: number) => {
    setActive(i);
    complete("valley");
  };

  return (
    <section id="valley" className="relative overflow-hidden bg-royal-glow py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHead num="01" eyebrow="The Valley" title={<>One Valley.<br /><span className="text-gold-gradient">Many Warriors.</span></>} sub="Tap a city to discover what it brings to the Gorkhas." />

        <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-border bg-card-glass shadow-royal">
              <svg viewBox="0 0 100 75" className="absolute inset-0 h-full w-full" preserveAspectRatio="none" aria-hidden>
                <path d="M0 20 L10 12 L18 16 L28 6 L36 13 L46 4 L56 12 L66 5 L76 13 L86 7 L100 15 L100 0 L0 0Z" fill="var(--royal-deep)" opacity=".8" />
                <path d="M8 45 C 15 25, 40 20, 60 28 S 92 30, 92 50 S 70 72, 45 70 S 4 62, 8 45Z" fill="none" stroke="var(--gold)" strokeOpacity=".25" strokeDasharray="1 1.5" strokeWidth=".4" />
                {[...Array(6)].map((_, i) => (
                  <path key={i} d={`M${12 + i * 2} ${48 - i} C 20 ${30 - i}, 45 ${26 - i}, 62 ${32 - i} S ${88 - i * 2} ${34}, ${88 - i * 2} ${50}`} fill="none" stroke="var(--foreground)" strokeOpacity=".05" strokeWidth=".3" />
                ))}
                {CITIES.slice(0, 3).map((p, i) => {
                  const q = CITIES[(i + 1) % 3];
                  return <line key={i} x1={p.x} y1={p.y * 0.75} x2={q.x} y2={q.y * 0.75} stroke="var(--gold)" strokeOpacity=".35" strokeWidth=".25" />;
                })}
                <line x1={CITIES[3].x} y1={CITIES[3].y * 0.75} x2={CITIES[0].x} y2={CITIES[0].y * 0.75} stroke="var(--gold)" strokeOpacity=".2" strokeDasharray="1 1" strokeWidth=".25" />
              </svg>
              {CITIES.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => pick(i)}
                  onMouseEnter={() => pick(i)}
                  className="group absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                  aria-label={p.name}
                >
                  <span className={cn("absolute inset-0 rounded-full bg-gold", active === i ? "animate-pulse-ring" : "opacity-0")} />
                  <span className={cn("relative block rounded-full border-2 border-gold transition-all duration-300", active === i ? "size-5 bg-gold shadow-gold" : "size-3.5 bg-background group-hover:bg-gold")} />
                  <span className={cn("absolute left-1/2 top-7 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.2em] transition-colors md:text-xs", active === i ? "text-gold" : "text-foreground/60")}>{p.name}</span>
                </button>
              ))}
              <span className="absolute bottom-4 left-4 text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">Kathmandu Valley · 1,400m</span>
            </div>
          </Reveal>

          <div key={c.id} className="animate-rise">
            <p className="font-deva text-3xl text-gold/80">{c.deva}</p>
            <h3 className="display mt-2 text-6xl md:text-7xl">{c.name}</h3>
            <p className="eyebrow mt-4">{c.tag}</p>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-foreground/80">{c.body}</p>
            <div className="mt-8 flex items-center gap-4 border-t border-border pt-6">
              <span className="display text-2xl text-gold">{String(active + 1).padStart(2, "0")}</span>
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">{c.fact}</span>
            </div>
            <div className="mt-8 flex gap-2">
              {CITIES.map((_, i) => (
                <button key={i} onClick={() => pick(i)} aria-label={CITIES[i].name} className={cn("h-1 rounded-full transition-all duration-500", i === active ? "w-12 bg-gold" : "w-6 bg-border")} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
