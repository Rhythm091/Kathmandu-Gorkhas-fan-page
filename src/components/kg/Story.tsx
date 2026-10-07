import { Counter, Prototype, Reveal, SectionHead } from "./primitives";

const CHAPTERS = [
  {
    k: "Chapter I",
    t: "The Valley",
    b: "Three royal cities, a ring of hills, and a cricket obsession that fills every rooftop on matchday.",
  },
  {
    k: "Chapter II",
    t: "The Khukuri",
    b: "The curved blade of the Gorkha — a symbol of courage that never strikes without reason.",
  },
  {
    k: "Chapter III",
    t: "The Franchise",
    b: "Kathmandu Gorkhas carry the Valley into the Nepal Premier League. Purple for pride, gold for glory.",
  },
  {
    k: "Chapter IV",
    t: "The Twelfth",
    b: "The story isn't finished. Every fan who joins writes the next line.",
  },
];

const PLAYER_STATS = [
  ["110", "T20I Matches"],
  ["3,277", "T20I Runs"],
  ["142.48", "T20I Strike Rate"],
];

const CAREER_STATS = [
  ["112", "Tests"],
  ["161", "ODIs"],
  ["110", "T20Is"],
];

export function Story() {
  return (
    <section id="story" className="relative py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHead
          num="06"
          eyebrow="The Gorkhas Story"
          title={
            <>
              Written in{" "}
              <span className="text-gold-gradient">courage.</span>
            </>
          }
        />

        {/* CHAPTERS */}
        <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-2 lg:grid-cols-4">
          {CHAPTERS.map((c, i) => (
            <Reveal
              key={c.t}
              delay={i * 100}
              className="group bg-background p-8 transition-colors duration-500 hover:bg-secondary"
            >
              <p className="eyebrow">{c.k}</p>

              <h3 className="display mt-6 text-4xl transition-colors group-hover:text-gold">
                {c.t}
              </h3>

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {c.b}
              </p>
            </Reveal>
          ))}
        </div>

        {/* STAR MOMENT */}
        <div className="mt-24 grid items-center gap-10 lg:grid-cols-2">
          {/* PLAYER IMAGE */}
          <Reveal className="group relative overflow-hidden rounded-lg">
            <img
              src="/daviddada.jpg"
              alt="David Warner"
              width={1280}
              height={1600}
              loading="lazy"
              decoding="async"
              className="aspect-[4/5] w-full object-cover object-top transition-transform duration-[1.2s] ease-out group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />

            <div className="absolute bottom-6 left-6">
              <Prototype />
            </div>
          </Reveal>

          {/* PLAYER INFO */}
          <Reveal delay={150}>
            <p className="eyebrow">Star moment · David Warner</p>

            <h3 className="display mt-4 text-6xl md:text-7xl">
              Meet the{" "}
              <span className="text-gold-gradient">Valley.</span>
            </h3>

            <p className="mt-6 max-w-md text-lg leading-relaxed text-foreground/80">
              One of cricket's most explosive openers. From Australia's
              biggest stages to the Kathmandu Valley, David Warner represents
              the aggression, experience, and fearless spirit that defines
              modern T20 cricket.
            </p>

            {/* T20I STATS */}
            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-border pt-8 sm:gap-6">
              {PLAYER_STATS.map(([value, label]) => (
                <div key={label}>
                  <div className="display text-4xl text-gold sm:text-5xl">
                    {value}
                  </div>

                  <div className="mt-2 text-[9px] font-bold uppercase tracking-[0.16em] text-muted-foreground sm:text-[10px] sm:tracking-[0.2em]">
                    {label}
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              Australia · T20I career figures
            </p>

            {/* INTERNATIONAL CAREER */}
            <div className="mt-8 border-t border-border pt-6">
              <div className="flex items-center justify-between gap-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  International career
                </p>

                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-gold">
                  49 centuries
                </span>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-4">
                {CAREER_STATS.map(([value, label]) => (
                  <div key={label}>
                    <div className="display text-3xl sm:text-4xl">
                      {value}
                    </div>

                    <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                      {label}
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-5 max-w-md text-xs leading-relaxed text-muted-foreground">
                18,995 international runs across three formats, including
                26 Test centuries and 22 ODI centuries.
              </p>
            </div>

            {/* GORKHAS / FAN CONNECTION */}
            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-border pt-8">
              {[
                [3, "Royal cities"],
                [1, "Team"],
                [12, "th Warrior"],
              ].map(([n, l]) => (
                <div key={l as string}>
                  <div className="display text-5xl">
                    <Counter to={n as number} />
                  </div>

                  <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    {l}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}