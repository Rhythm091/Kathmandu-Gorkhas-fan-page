import { useState } from "react";
import { RotateCcw, Share2 } from "lucide-react";
import { Btn, SectionHead } from "./primitives";
import { useWarrior } from "@/lib/warrior";
import { cn } from "@/lib/utils";

type Strat = "ATTACK" | "ROTATE STRIKE" | "TAKE THE RISK";
type Ball = { r: number; label: string };

const ODDS: Record<Strat, [number, string, number][]> = {
  // [runs, label, weight]  — runs -1 = wicket
  ATTACK: [[6, "SIX", 22], [4, "FOUR", 24], [1, "SINGLE", 16], [0, "DOT BALL", 20], [-1, "WICKET", 18]],
  "ROTATE STRIKE": [[1, "SINGLE", 42], [2, "TWO", 30], [4, "FOUR", 8], [0, "DOT BALL", 15], [-1, "WICKET", 5]],
  "TAKE THE RISK": [[6, "SIX", 34], [4, "FOUR", 14], [0, "DOT BALL", 20], [-1, "WICKET", 32]],
};
const TARGET = 12;

function roll(s: Strat): Ball {
  const t = ODDS[s].reduce((a, o) => a + o[2], 0);
  let x = Math.random() * t;
  for (const [r, label, w] of ODDS[s]) if ((x -= w) < 0) return { r, label };
  return { r: 0, label: "DOT BALL" };
}

const rankOf = (n: number) => (n > 80 ? "Gorkha Captain" : n > 60 ? "Elite Warrior" : n > 30 ? "Warrior" : "Rookie");

export function Lab() {
  const { complete, setLabScore } = useWarrior();
  const [balls, setBalls] = useState<Ball[]>([]);
  const [flash, setFlash] = useState<Ball | null>(null);
  const [busy, setBusy] = useState(false);

  const runs = balls.reduce((a, b) => a + Math.max(0, b.r), 0);
  const wkts = balls.filter((b) => b.r < 0).length;
  const done = balls.length >= 6 || runs >= TARGET || wkts >= 2;
  const won = runs >= TARGET;
  const score = Math.min(100, Math.round((won ? 60 : 0) + Math.min(runs, 20) * 2 + (6 - balls.length) * 4 - wkts * 8));
  const finalScore = Math.max(0, score);

  const play = (s: Strat) => {
    if (busy || done) return;
    setBusy(true);
    setFlash(null);
    setTimeout(() => {
      const b = roll(s);
      const next = [...balls, b];
      setBalls(next);
      setFlash(b);
      setBusy(false);
      const r = next.reduce((a, x) => a + Math.max(0, x.r), 0);
      const w = next.filter((x) => x.r < 0).length;
      if (next.length >= 6 || r >= TARGET || w >= 2) {
        const sc = Math.max(0, Math.min(100, Math.round((r >= TARGET ? 60 : 0) + Math.min(r, 20) * 2 + (6 - next.length) * 4 - w * 8)));
        setLabScore(sc);
        complete("lab");
      }
    }, 650);
  };
  const reset = () => (setBalls([]), setFlash(null));
  const share = () => {
    const t = `Gorkha Lab score: ${finalScore} — ${rankOf(finalScore)}. Think like a Gorkha. #KathmanduGorkhas`;
    navigator.share ? navigator.share({ text: t }).catch(() => {}) : navigator.clipboard?.writeText(t);
  };

  return (
    <section id="lab" className="relative overflow-hidden bg-ink py-24 md:py-36">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gold-gradient opacity-40" />
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHead num="03" eyebrow="The Gorkha Lab" title={<>Think like a Gorkha.<br /><span className="text-gold-gradient">Play the moment.</span></>} />

        <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
          {/* scoreboard */}
          <div className="grain relative overflow-hidden rounded-lg border border-border bg-card-glass p-6 shadow-royal md:p-10">
            <div className="flex items-center justify-between">
              <span className="eyebrow">Final over</span>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Need {TARGET} from 6</span>
            </div>
            <div className="mt-8 flex items-end justify-between">
              <div>
                <div className="display text-[7rem] leading-none md:text-[10rem]">{runs}<span className="text-4xl text-muted-foreground">/{wkts}</span></div>
                <div className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  {done ? (won ? "Target chased" : "Fell short") : `${Math.max(0, TARGET - runs)} needed · ${6 - balls.length} balls`}
                </div>
              </div>
              <div className="relative flex h-32 w-40 items-center justify-center md:w-56">
                {busy && <span className="size-6 rounded-full bg-destructive shadow-[0_0_30px] shadow-destructive animate-ping" />}
                {flash && !busy && (
                  <span key={balls.length} className={cn("display animate-pop text-center text-5xl md:text-7xl", flash.r >= 4 ? "text-gold-gradient" : flash.r < 0 ? "text-destructive" : "text-foreground")}>
                    {flash.label}
                  </span>
                )}
              </div>
            </div>
            <div className="mt-8 grid grid-cols-6 gap-2">
              {[...Array(6)].map((_, i) => {
                const b = balls[i];
                return (
                  <div key={i} className={cn("flex aspect-square items-center justify-center rounded-full border font-display text-xl font-bold transition-all", !b && "border-border text-muted-foreground", b && b.r >= 4 && "border-gold bg-gold text-primary-foreground animate-pop", b && b.r < 0 && "border-destructive bg-destructive/20 text-destructive animate-pop", b && b.r >= 0 && b.r < 4 && "border-foreground/40 animate-pop")}>
                    {b ? (b.r < 0 ? "W" : b.r === 0 ? "•" : b.r) : i + 1}
                  </div>
                );
              })}
            </div>
          </div>

          {/* controls */}
          <div className="flex flex-col justify-center">
            {!done ? (
              <>
                <p className="eyebrow">Choose your strategy · Ball {balls.length + 1}</p>
                <div className="mt-6 flex flex-col gap-3">
                  {(["ATTACK", "ROTATE STRIKE", "TAKE THE RISK"] as Strat[]).map((s, i) => (
                    <button key={s} disabled={busy} onClick={() => play(s)} className="group flex items-center justify-between rounded-sm border border-border bg-secondary/40 px-6 py-5 text-left transition-all duration-300 hover:border-gold hover:bg-gold/10 hover:shadow-gold active:scale-[0.98] disabled:opacity-50">
                      <span className="display text-3xl transition-colors group-hover:text-gold">{s}</span>
                      <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">{["High reward", "Safe build", "All or nothing"][i]}</span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="animate-rise">
                <p className="eyebrow">You finished with {runs} runs</p>
                <p className="mt-4 text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">Gorkha Lab score</p>
                <div className="display text-[8rem] leading-none text-gold-gradient">{finalScore}</div>
                <p className="display mt-2 text-4xl">{rankOf(finalScore)}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Btn onClick={reset}><RotateCcw className="size-4" /> Play again</Btn>
                  <Btn variant="outline" onClick={share}><Share2 className="size-4" /> Share my score</Btn>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
