import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Share2, Sparkles } from "lucide-react";
import { Btn, Chip, SectionHead } from "./primitives";
import {
  generateArchetype,
  makeId,
  useWarrior,
  type Profile,
} from "@/lib/warrior";
import { cn } from "@/lib/utils";

const CITIES = [
  "Kathmandu",
  "Lalitpur",
  "Bhaktapur",
  "Nuwakot",
  "Beyond the Valley",
];

const ROLES = [
  "The Strategist",
  "The Finisher",
  "The Leader",
  "The Believer",
  "The Challenger",
];

const STYLES = ["Attack", "Defend", "Adapt", "Lead"];

export function WarriorCard({
  p,
  compact,
}: {
  p: Profile;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "grain relative overflow-hidden rounded-lg border border-gold/40 bg-card-glass shadow-royal",
        compact
          ? "aspect-[3/4] w-full max-w-xs"
          : "aspect-[3/4] w-full max-w-sm",
      )}
    >
      <div className="absolute -right-16 -top-16 size-64 rounded-full bg-royal opacity-60 blur-3xl" />
      <div className="absolute -bottom-20 -left-10 size-56 rounded-full bg-gold opacity-20 blur-3xl" />

      {/* Background logo */}
      <img
        src="/logo.png"
        alt=""
        aria-hidden="true"
        className="absolute -right-10 bottom-10 size-64 object-contain opacity-10 animate-spin-slow"
      />

      <div className="relative flex h-full flex-col justify-between p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="eyebrow">Kathmandu Gorkhas</p>
            <p className="mt-1 font-mono text-[10px] text-muted-foreground">
              {p.id}
            </p>
          </div>

          {/* Card logo */}
          <img
            src="/logo.png"
            alt="Kathmandu Gorkhas"
            className="size-12 object-contain"
          />
        </div>

        <div>
          <p className="display text-6xl text-gold-gradient">12th</p>
          <p className="display text-5xl">Warrior</p>

          <div className="mt-6 h-px bg-gold/30" />

          <p className="display mt-4 text-3xl">
            {p.name || "Your Name"}
          </p>

          <div className="mt-3 grid grid-cols-3 gap-2 text-[10px] font-bold uppercase tracking-[0.15em]">
            <div>
              <span className="block text-muted-foreground">City</span>
              {p.city || "—"}
            </div>

            <div>
              <span className="block text-muted-foreground">Role</span>
              {p.role.replace("The ", "") || "—"}
            </div>

            <div>
              <span className="block text-muted-foreground">Style</span>
              {p.style || "—"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Warrior() {
  const { profile, setProfile } = useWarrior();

  const [step, setStep] = useState(0);

  const [d, setD] = useState<Profile>({
    name: "",
    city: "",
    role: "",
    style: "",
    id: "KG-12-•••••",
  });

  const [ai, setAi] = useState<{
    archetype: string;
    trait: string;
    line: string;
  } | null>(null);

  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (profile && step === 0 && !d.name) {
      setD(profile);
      setStep(5);
      generateArchetype(profile).then(setAi);
    }
  }, [profile]); // eslint-disable-line react-hooks/exhaustive-deps

  const valid =
    [d.name.trim().length > 1, !!d.city, !!d.role, !!d.style][step] ?? true;

  const finish = async () => {
    const p = { ...d, id: makeId(d.name) };

    setD(p);
    setStep(4);
    setAi(null);
    setPhase(0);

    const t1 = setTimeout(() => setPhase(1), 700);
    const t2 = setTimeout(() => setPhase(2), 1400);

    const r = await generateArchetype(p);

    clearTimeout(t1);
    clearTimeout(t2);

    setProfile(p);
    setAi(r);
    setStep(5);
  };

  const share = async () => {
    const text = `I'm ${d.name}, ${
      ai?.archetype ?? "a 12th Warrior"
    } of the Kathmandu Gorkhas. Three Cities. One Soul. ${d.id}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "12th Warrior",
          text,
        });
      } else {
        await navigator.clipboard.writeText(text);
      }
    } catch {}
  };

  const titles = [
    "What do they call you?",
    "Where does your heart belong?",
    "Choose your warrior role",
    "How do you play the moment?",
  ];

  return (
    <section id="warrior" className="relative py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHead
          num="02"
          eyebrow="Join the ranks"
          title={
            <>
              Become the
              <br />
              <span className="text-gold-gradient">12th Warrior.</span>
            </>
          }
          sub="Eleven take the field. You're the one who carries them."
        />

        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="min-h-[420px]">
            {step < 4 && (
              <div key={step} className="animate-rise">
                <div className="mb-8 flex gap-2">
                  {[0, 1, 2, 3].map((i) => (
                    <span
                      key={i}
                      className={cn(
                        "h-1 flex-1 rounded-full transition-all duration-500",
                        i <= step ? "bg-gold" : "bg-border",
                      )}
                    />
                  ))}
                </div>

                <p className="eyebrow">
                  Step {step + 1} / 4
                </p>

                <h3 className="display mt-3 text-4xl md:text-5xl">
                  {titles[step]}
                </h3>

                <div className="mt-8">
                  {step === 0 && (
                    <input
                      autoFocus
                      value={d.name}
                      maxLength={22}
                      onChange={(e) =>
                        setD({
                          ...d,
                          name: e.target.value,
                        })
                      }
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        valid &&
                        setStep(1)
                      }
                      placeholder="Your name"
                      className="w-full border-b-2 border-border bg-transparent pb-3 font-display text-4xl font-bold uppercase outline-none transition-colors placeholder:text-muted-foreground/40 focus:border-gold"
                    />
                  )}

                  {step === 1 && (
                    <div className="grid grid-cols-2 gap-3">
                      {CITIES.map((c) => (
                        <Chip
                          key={c}
                          active={d.city === c}
                          onClick={() =>
                            setD({
                              ...d,
                              city: c,
                            })
                          }
                        >
                          {c}
                        </Chip>
                      ))}
                    </div>
                  )}

                  {step === 2 && (
                    <div className="grid grid-cols-2 gap-3">
                      {ROLES.map((c) => (
                        <Chip
                          key={c}
                          active={d.role === c}
                          onClick={() =>
                            setD({
                              ...d,
                              role: c,
                            })
                          }
                        >
                          {c}
                        </Chip>
                      ))}
                    </div>
                  )}

                  {step === 3 && (
                    <div className="grid grid-cols-2 gap-3">
                      {STYLES.map((c) => (
                        <Chip
                          key={c}
                          active={d.style === c}
                          onClick={() =>
                            setD({
                              ...d,
                              style: c,
                            })
                          }
                        >
                          <span className="display block text-2xl">
                            {c}
                          </span>
                        </Chip>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-10 flex items-center gap-4">
                  {step > 0 && (
                    <Btn
                      variant="ghost"
                      onClick={() => setStep(step - 1)}
                    >
                      <ArrowLeft className="size-4" />
                      Back
                    </Btn>
                  )}

                  <Btn
                    disabled={!valid}
                    onClick={() =>
                      step === 3 ? finish() : setStep(step + 1)
                    }
                  >
                    {step === 3
                      ? "Forge my identity"
                      : "Continue"}

                    <ArrowRight className="size-4" />
                  </Btn>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="animate-rise">
                <p className="eyebrow flex items-center gap-2">
                  <Sparkles className="size-4" />
                  Meet your Gorkha
                </p>

                <div className="mt-8 space-y-4">
                  {[
                    "Analysing your instincts",
                    "Matching to the Valley",
                    "Generating identity",
                  ].map((t, i) => (
                    <div
                      key={t}
                      className={cn(
                        "flex items-center gap-4 transition-opacity duration-500",
                        phase >= i ? "opacity-100" : "opacity-25",
                      )}
                    >
                      <span
                        className={cn(
                          "size-2 rounded-full",
                          phase > i
                            ? "bg-gold"
                            : phase === i
                              ? "bg-gold animate-pulse"
                              : "bg-border",
                        )}
                      />

                      <span className="display text-3xl">
                        {t}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 5 && ai && (
              <div className="animate-rise">
                <p className="eyebrow flex items-center gap-2">
                  <Sparkles className="size-4" />
                  Your Gorkha archetype
                </p>

                <h3 className="display mt-4 text-5xl text-gold-gradient md:text-7xl">
                  {ai.archetype}
                </h3>

                <blockquote className="mt-6 max-w-md border-l-2 border-gold pl-5 text-xl leading-relaxed text-foreground/90">
                  “{ai.line}”
                </blockquote>

                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <Btn onClick={share}>
                    <Share2 className="size-4" />
                    Share my card
                  </Btn>

                  <a href="#lab">
                    <Btn variant="outline">
                      Enter the Lab
                      <ArrowRight className="size-4" />
                    </Btn>
                  </a>

                  <Btn
                    variant="ghost"
                    onClick={() => {
                      setStep(0);
                      setAi(null);
                    }}
                  >
                    Redo
                  </Btn>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-center lg:justify-end">
            <div
              className={cn(
                "transition-transform duration-700",
                step === 4 && "scale-95 animate-pulse",
              )}
            >
              <WarriorCard p={d} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}