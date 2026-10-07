import { useState } from "react";
import { Eye } from "lucide-react";
import { Btn, Chip, Prototype, SectionHead } from "./primitives";
import { useWarrior } from "@/lib/warrior";

const QS = [
  { q: "How will the Gorkhas start the chase?", opts: ["Fireworks in the powerplay", "Build, then explode", "Slow burn, late finish"] },
  { q: "Sixes hit by the Gorkhas tonight?", opts: ["0–5", "6–9", "10+"] },
  { q: "What decides the match?", opts: ["Spin in the middle overs", "Death bowling", "One big innings"] },
];

export function Oracle() {
  const { complete, setPrediction, prediction } = useWarrior();
  const [ans, setAns] = useState<string[]>([]);
  const [i, setI] = useState(0);
  const sealed = !!prediction && ans.length === 0;
  const doneNow = ans.length === QS.length;

  const choose = (o: string) => {
    const next = [...ans];
    next[i] = o;
    setAns(next);
    setTimeout(() => {
      if (i < QS.length - 1) setI(i + 1);
      else { setPrediction(next.join(" · ")); complete("oracle"); }
    }, 350);
  };

  return (
    <section id="oracle" className="relative py-24 md:py-36">
      <div className="mx-auto max-w-5xl px-5 text-center md:px-8">
        <div className="mx-auto mb-8 flex size-16 items-center justify-center rounded-full border border-gold/40 shadow-gold">
          <Eye className="size-7 text-gold" />
        </div>
        <SectionHead num="04" eyebrow="The Match Oracle" title={<>Trust your <span className="text-gold-gradient">instinct.</span></>} />

        {sealed || doneNow ? (
          <div className="animate-rise mx-auto max-w-xl rounded-lg border border-gold/40 bg-card-glass p-8 shadow-royal">
            <p className="eyebrow">Prediction sealed</p>
            <p className="display mt-4 text-3xl leading-tight md:text-4xl">{prediction}</p>
            <p className="mt-4 text-sm text-muted-foreground">Results unlock on matchday. Correct calls earn Warrior XP.</p>
            <Btn variant="ghost" className="mt-6" onClick={() => { setAns([]); setI(0); setPrediction(""); }}>Change my call</Btn>
          </div>
        ) : (
          <div key={i} className="animate-rise mx-auto max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Question {i + 1} of {QS.length}</p>
            <h3 className="display mt-4 text-4xl md:text-5xl">{QS[i].q}</h3>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {QS[i].opts.map((o) => <Chip key={o} active={ans[i] === o} onClick={() => choose(o)}>{o}</Chip>)}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
