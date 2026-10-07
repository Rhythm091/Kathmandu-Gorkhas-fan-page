import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { MISSIONS, rankFor, useWarrior } from "@/lib/warrior";
import { cn } from "@/lib/utils";

export function Loader() {
  const [gone, setGone] = useState(false);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const a = setTimeout(() => setPhase(1), 700);
    const b = setTimeout(() => setGone(true), 1700);

    return () => (clearTimeout(a), clearTimeout(b));
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink transition-all duration-700",
        gone &&
          "pointer-events-none opacity-0 [clip-path:inset(0_0_100%_0)]",
      )}
    >
      <img
        src="/logo.png"
        alt="Kathmandu Gorkhas"
        className="size-40 object-contain animate-pop"
      />

      <p className="display mt-6 text-2xl tracking-[0.2em]">
        Kathmandu Gorkhas
      </p>

      <p
        className={cn(
          "eyebrow mt-3 transition-opacity duration-500",
          phase ? "opacity-100" : "opacity-0",
        )}
      >
        Three Cities. One Soul.
      </p>

      <div className="mt-8 h-px w-48 bg-border">
        <div className="h-px bg-gold animate-load" />
      </div>
    </div>
  );
}

const LINKS = [
  ["Valley", "#valley"],
  ["Warrior", "#warrior"],
  ["Lab", "#lab"],
  ["Oracle", "#oracle"],
  ["Kit", "#kit"],
  ["Story", "#story"],
] as const;

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const { xp, missions, profile } = useWarrior();

  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 40);

    f();

    window.addEventListener("scroll", f, { passive: true });

    return () => window.removeEventListener("scroll", f);
  }, []);

  const pct = (missions.length / MISSIONS.length) * 100;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-border"
            : "",
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
          {/* Logo */}
          <a href="#top" className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Kathmandu Gorkhas"
              className="h-15 w-auto object-contain"
            />

            <span className="display text-lg tracking-[0.15em]">
              KATHMANDU Gorkhas
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 lg:flex">
            {LINKS.map(([l, h]) => (
              <a
                key={h}
                href={h}
                className="text-xs font-bold uppercase tracking-[0.22em] text-foreground/70 transition-colors hover:text-gold"
              >
                {l}
              </a>
            ))}
          </nav>

          {/* XP + Mobile Menu */}
          <div className="flex items-center gap-3">
            <a
              href="#progress"
              className="flex items-center gap-3 rounded-sm border border-border bg-secondary/50 px-3 py-1.5"
            >
              <div className="text-right leading-tight">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  {profile ? profile.name.split(" ")[0] : rankFor(xp)}
                </div>

                <div className="font-display text-sm font-bold text-gold">
                  {xp} XP
                </div>
              </div>

              <div className="relative size-8">
                <svg
                  viewBox="0 0 36 36"
                  className="size-8 -rotate-90"
                >
                  <circle
                    cx="18"
                    cy="18"
                    r="15"
                    fill="none"
                    stroke="var(--border)"
                    strokeWidth="3"
                  />

                  <circle
                    cx="18"
                    cy="18"
                    r="15"
                    fill="none"
                    stroke="var(--gold)"
                    strokeWidth="3"
                    strokeDasharray={`${pct * 0.94} 100`}
                    className="transition-all duration-700"
                  />
                </svg>
              </div>
            </a>

            <button
              className="lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="size-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 z-[60] flex flex-col bg-ink/98 p-6 transition-all duration-500 lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <button
          className="self-end"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
        >
          <X className="size-7" />
        </button>

        <nav className="mt-10 flex flex-col gap-4">
          {LINKS.map(([l, h], i) => (
            <a
              key={h}
              href={h}
              onClick={() => setOpen(false)}
              className="display text-5xl hover:text-gold"
              style={{
                transitionDelay: `${i * 40}ms`,
              }}
            >
              <span className="mr-4 font-sans text-sm text-gold">
                0{i + 1}
              </span>

              {l}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}