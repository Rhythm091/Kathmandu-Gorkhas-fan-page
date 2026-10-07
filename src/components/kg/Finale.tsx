import { useEffect, useRef, useState } from "react";
import { Check, Download, Lock, Share2 } from "lucide-react";
import { toPng } from "html-to-image";
import { Btn, Reveal, SectionHead } from "./primitives";
import { MISSIONS, rankFor, useWarrior } from "@/lib/warrior";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────
   PROGRESS
───────────────────────────────────────────── */

export function Progress() {
  const { missions, xp } = useWarrior();
  const max = MISSIONS.reduce((a, m) => a + m.xp, 0);

  return (
    <section id="progress" className="relative bg-ink py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHead
          num="07"
          eyebrow="Warrior progression"
          title={
            <>
              Rank:{" "}
              <span className="text-gold-gradient">
                {rankFor(xp)}
              </span>
            </>
          }
        />

        <div className="mb-10 h-2 overflow-hidden rounded-full bg-border">
          <div
            className="h-full bg-gold-gradient transition-all duration-1000"
            style={{
              width: `${max > 0 ? Math.min(100, (xp / max) * 100) : 0}%`,
            }}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {MISSIONS.map((m, i) => {
            const done = missions.includes(m.id);

            return (
              <Reveal
                key={m.id}
                delay={i * 80}
                className={cn(
                  "rounded-lg border p-6 transition-all",
                  done
                    ? "border-gold/50 bg-gold/5"
                    : "border-border",
                )}
              >
                <div
                  className={cn(
                    "flex size-10 items-center justify-center rounded-full",
                    done
                      ? "bg-gold text-primary-foreground"
                      : "border border-border text-muted-foreground",
                  )}
                >
                  {done ? (
                    <Check className="size-5" />
                  ) : (
                    <Lock className="size-4" />
                  )}
                </div>

                <p className="display mt-6 text-2xl">
                  {m.label}
                </p>

                <p
                  className={cn(
                    "mt-2 text-xs font-bold uppercase tracking-[0.2em]",
                    done
                      ? "text-gold"
                      : "text-muted-foreground",
                  )}
                >
                  +{m.xp} XP
                </p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   MEMORY
───────────────────────────────────────────── */

export function Memory() {
  const { profile, labScore, prediction, xp } = useWarrior();

  const cardRef = useRef<HTMLDivElement>(null);

  const download = async () => {
    if (!cardRef.current) return;

    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 3,
        cacheBust: true,
        backgroundColor: "#120a18",
        skipFonts: false,
      });

      const link = document.createElement("a");
      link.download = "gorkhas-memory.png";
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error(
        "Failed to create memory card:",
        error,
      );
    }
  };

  const share = async () => {
    const text = `My Gorkhas memory: ${
      profile?.name ?? "A 12th Warrior"
    } from ${profile?.city ?? "the Valley"}. Lab score ${
      labScore ?? "—"
    }. Three Cities. One Soul.`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Kathmandu Gorkhas · 12th Warrior",
          text,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      }
    } catch {}
  };

  return (
    <section className="relative overflow-hidden py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHead
          num="08"
          eyebrow="Your Gorkhas memory"
          title={
            <>
              Your night.
              <br />
              <span className="text-gold-gradient">
                Your story.
              </span>
            </>
          }
          sub="Everything you did tonight, stitched into one keepsake."
        />

        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* MEMORY CARD */}
          <Reveal className="mx-auto w-full max-w-md">
            <div
              ref={cardRef}
              className="grain relative aspect-[4/5] w-full overflow-hidden rounded-lg border border-gold/40 bg-card-glass p-8 shadow-royal"
            >
              <img
                src="/logo.png"
                alt=""
                aria-hidden="true"
                className="absolute -right-16 -top-16 size-72 object-contain opacity-10"
              />

              <div className="relative flex h-full flex-col">
                <div className="flex items-start justify-between gap-6">
                  <div className="min-w-0">
                    <p className="eyebrow leading-relaxed">
                      Kathmandu Gorkhas
                      <br />
                      <span className="text-[8px] tracking-[0.22em]">
                        Memory
                      </span>
                    </p>

                    <p className="mt-3 font-mono text-[9px] leading-none text-muted-foreground">
                      {profile?.id ?? "KG-12-•••••"}
                    </p>
                  </div>

                  <img
                    src="/logo.png"
                    alt="Kathmandu Gorkhas"
                    className="size-12 shrink-0 object-contain"
                  />
                </div>

                <div className="mt-10">
                  <p className="display text-7xl text-gold-gradient">
                    12th
                  </p>

                  <p className="display text-7xl">
                    Warrior
                  </p>
                </div>

                <div className="mt-6 h-px bg-gold/30" />

                <div>
                  <p className="display mt-6 text-4xl">
                    {profile?.name ?? "Your name here"}
                  </p>

                  {profile && (
                    <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                      {profile.role?.replace("The ", "")} ·{" "}
                      {profile.style}
                    </p>
                  )}
                </div>

                <div className="mt-auto grid grid-cols-3 gap-3 border-t border-gold/30 pt-6 text-[10px] font-bold uppercase tracking-[0.15em]">
                  <div className="min-w-0">
                    <span className="mb-1 block text-muted-foreground">
                      City
                    </span>

                    <span className="block truncate">
                      {profile?.city ?? "—"}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <span className="mb-1 block text-muted-foreground">
                      Lab
                    </span>

                    <span className="block text-gold">
                      {labScore ?? "—"}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <span className="mb-1 block text-muted-foreground">
                      Rank
                    </span>

                    <span className="block truncate">
                      {rankFor(xp)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* MEMORY DETAILS */}
          <Reveal delay={150}>
            <ul className="space-y-5">
              {[
                [
                  "Warrior",
                  profile
                    ? `${profile.role} · ${profile.style}`
                    : "Not yet forged",
                ],
                [
                  "Gorkha Lab",
                  labScore != null
                    ? `Best score ${labScore}`
                    : "Not played",
                ],
                [
                  "Oracle",
                  prediction || "No prediction sealed",
                ],
              ].map(([k, v]) => (
                <li
                  key={k}
                  className="flex items-baseline justify-between gap-6 border-b border-border pb-4"
                >
                  <span className="eyebrow">
                    {k}
                  </span>

                  <span className="text-right font-semibold">
                    {v}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap gap-3">
              <Btn onClick={download}>
                <Download className="size-4" />
                Download
              </Btn>

              <Btn
                variant="outline"
                onClick={share}
              >
                <Share2 className="size-4" />
                Share
              </Btn>
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              Download your 12th Warrior card as a high-resolution
              keepsake.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   MATCH COUNTDOWN
───────────────────────────────────────────── */

function MatchCountdown() {
  const matchDate =
    new Date("2026-10-29T12:30:00+05:45").getTime();

  const getRemaining = () => {
    const difference = matchDate - Date.now();

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        started: true,
      };
    }

    return {
      days: Math.floor(
        difference / (1000 * 60 * 60 * 24),
      ),

      hours: Math.floor(
        (difference / (1000 * 60 * 60)) % 24,
      ),

      minutes: Math.floor(
        (difference / (1000 * 60)) % 60,
      ),

      seconds: Math.floor(
        (difference / 1000) % 60,
      ),

      started: false,
    };
  };

  const [time, setTime] = useState(getRemaining);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTime(getRemaining());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  if (time.started) {
    return (
      <div className="relative overflow-hidden rounded-xl border border-gold/40 bg-gold/5 px-6 py-8 shadow-[0_0_60px_-25px_var(--gold)] md:px-10 md:py-10">
        <div className="absolute inset-0 bg-gold/5 blur-3xl" />

        <div className="relative">
          <div className="flex items-center justify-center gap-3">
            <span className="size-2 animate-pulse rounded-full bg-gold shadow-[0_0_14px_var(--gold)]" />

            <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-gold">
              Match Day
            </p>
          </div>

          <p className="mt-4 text-center font-display text-2xl font-bold md:text-3xl">
            Janakpur Bolts
            <span className="mx-3 text-gold">
              vs
            </span>
            Kathmandu Gorkhas
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative overflow-hidden rounded-xl border border-gold/25 bg-background/60 px-5 py-8 shadow-[0_0_80px_-30px_var(--gold)] backdrop-blur-md md:px-10 md:py-10">
      {/* SOFT CENTRAL GLOW */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 size-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/5 blur-3xl transition-all duration-1000 group-hover:bg-gold/10" />

      {/* MOVING LIGHT */}
      <div className="countdown-light countdown-light-top" />
      <div className="countdown-light countdown-light-bottom" />

      <div className="relative">
        {/* HEADER */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-3">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-gold opacity-50" />
              <span className="relative inline-flex size-2 rounded-full bg-gold shadow-[0_0_12px_var(--gold)]" />
            </span>

            <p className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-gold">
              First match
            </p>
          </div>

          <p className="mt-4 font-display text-2xl font-bold tracking-tight md:text-4xl">
            Janakpur Bolts
            <span className="mx-3 text-gold">
              vs
            </span>
            Kathmandu Gorkhas
          </p>

          <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground md:text-xs">
            October 29, 2026 · 12:30 PM NPT · Kirtipur
          </p>
        </div>

        {/* COUNTDOWN */}
        <div className="mx-auto mt-8 grid max-w-3xl grid-cols-4 gap-2 md:gap-4">
          {[
            ["DAYS", time.days],
            ["HOURS", time.hours],
            ["MIN", time.minutes],
            ["SEC", time.seconds],
          ].map(([label, value]) => (
            <div
              key={label}
              className="relative overflow-hidden rounded-lg border border-gold/15 bg-secondary/30 px-2 py-5 text-center transition-all duration-500 hover:border-gold/40 hover:bg-gold/5 hover:shadow-[0_0_30px_-18px_var(--gold)] md:px-4 md:py-6"
            >
              <div className="font-display text-4xl font-bold leading-none text-gold md:text-6xl">
                {String(value).padStart(2, "0")}
              </div>

              <div className="mt-2 text-[8px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground md:text-[9px]">
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* BOTTOM LINE */}
        <div className="mt-7 flex items-center justify-center gap-3">
          <span className="h-px w-10 bg-gold/20 md:w-20" />

          <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
            The Valley is waiting
          </span>

          <span className="h-px w-10 bg-gold/20 md:w-20" />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SPONSORS
───────────────────────────────────────────── */

export function Sponsor() {
  const partners = [
    {
      name: "Xtreme Energy Drink",
      role: "Title Sponsor",
      description:
        "Powering Kathmandu Gorkhas through NPL Season 3.",
    },
    {
      name: "Shikhar Insurance",
      role: "Golden Partner",
      description:
        "Supporting the Gorkhas for a third consecutive NPL season.",
    },
    {
      name: "Century",
      role: "Official Sponsor",
      description:
        "Century branding features across the official jersey, helmets and caps.",
    },
    {
      name: "Hotel Crowne Imperial",
      role: "Hospitality Partner",
      description:
        "Official accommodation and hospitality partner for the Gorkhas squad.",
    },
  ];

  return (
    <section className="relative overflow-hidden border-y border-border py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">

        {/* SIMPLE PARTNER HEADER */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">
              Our partners
            </p>

            <h3 className="display mt-3 text-4xl md:text-6xl">
              Brands behind
              <br />
              <span className="text-gold-gradient">
                the Gorkhas.
              </span>
            </h3>

            <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
              The brands supporting Kathmandu Gorkhas as the
              team enters Nepal Premier League Season 3.
            </p>
          </div>
        </div>

        {/* PARTNER CARDS */}
        <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {partners.map((partner, i) => (
            <Reveal
              key={partner.name}
              delay={i * 80}
              className="group relative bg-background p-7 transition-colors duration-500 hover:bg-secondary"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-muted-foreground">
                  0{i + 1}
                </span>

                <span className="size-1.5 rounded-full bg-gold opacity-60 transition-all duration-300 group-hover:scale-150 group-hover:opacity-100" />
              </div>

              <div className="mt-12">
                <p className="eyebrow">
                  {partner.role}
                </p>

                <h4 className="display mt-4 text-3xl leading-none transition-colors duration-300 group-hover:text-gold">
                  {partner.name}
                </h4>

                <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                  {partner.description}
                </p>
              </div>

              <div className="mt-8 h-px w-8 bg-gold/40 transition-all duration-500 group-hover:w-full group-hover:bg-gold" />
            </Reveal>
          ))}
        </div>

        {/* FIRST MATCH COUNTDOWN
            This intentionally comes AFTER all sponsor names/cards. */}
        <div className="mt-16">
          <MatchCountdown />
        </div>

        {/* PARTNER STATUS */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Kathmandu Gorkhas · NPL Season 3
          </p>

          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold">
            More partners may be announced
          </p>
        </div>
      </div>

      {/* COUNTDOWN ANIMATION */}
      <style>{`
        .countdown-light {
          position: absolute;
          width: 35%;
          height: 1px;
          opacity: 0.7;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 210, 90, 0.8),
            transparent
          );
        }

        .countdown-light-top {
          left: -35%;
          top: 0;
          animation: countdownSweep 7s linear infinite;
        }

        .countdown-light-bottom {
          right: -35%;
          bottom: 0;
          animation: countdownSweepReverse 9s linear infinite;
        }

        @keyframes countdownSweep {
          0% {
            transform: translateX(0);
          }

          100% {
            transform: translateX(390%);
          }
        }

        @keyframes countdownSweepReverse {
          0% {
            transform: translateX(0);
          }

          100% {
            transform: translateX(-390%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .countdown-light {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}

/* ─────────────────────────────────────────────
   FINAL FOOTER
───────────────────────────────────────────── */

export function Final() {
  return (
    <footer className="grain relative overflow-hidden bg-royal-glow pb-10 pt-32 text-center">
      <img
        src="/logo.png"
        alt="Kathmandu Gorkhas"
        className="mx-auto size-40 object-contain animate-float"
      />

      <h2 className="display mx-auto mt-10 max-w-5xl px-5 text-6xl md:text-9xl">
        One team.
        <br />
        <span className="text-gold-gradient">
          One dream.
        </span>
      </h2>

      <p className="mt-6 text-sm font-bold uppercase tracking-[0.3em] text-muted-foreground">
        Kathmandu · Lalitpur · Bhaktapur
      </p>

      <a
        href="#warrior"
        className="mt-10 inline-block"
      >
        <Btn>
          Take your place
        </Btn>
      </a>

      {/* FOOTER META */}
      <div className="mx-auto mt-12 flex max-w-7xl flex-wrap items-center justify-between gap-4 border-t border-border px-5 pt-8 text-xs text-muted-foreground md:px-8">
        <span>
          Fan experience concept for Kathmandu Gorkhas · Not an official site
        </span>

        <span>
          Nepal Premier League
        </span>
      </div>
    </footer>
  );
}
