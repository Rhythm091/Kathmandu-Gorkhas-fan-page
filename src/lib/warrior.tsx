import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Mission = "profile" | "lab" | "oracle" | "valley" | "jersey";
export const MISSIONS: { id: Mission; label: string; xp: number }[] = [
  { id: "valley", label: "Explore the Valley", xp: 100 },
  { id: "profile", label: "Become a 12th Warrior", xp: 250 },
  { id: "lab", label: "Play Gorkha Lab", xp: 200 },
  { id: "oracle", label: "Consult the Oracle", xp: 150 },
  { id: "jersey", label: "Visit the Kit Room", xp: 100 },
];

export type Profile = {
  name: string;
  city: string;
  role: string;
  style: string;
  id: string;
};

type State = {
  profile: Profile | null;
  missions: Mission[];
  labScore: number | null;
  prediction: string | null;
};

type Ctx = State & {
  setProfile: (p: Profile) => void;
  complete: (m: Mission) => void;
  setLabScore: (n: number) => void;
  setPrediction: (s: string) => void;
  xp: number;
};

const C = createContext<Ctx | null>(null);
const KEY = "kg-12th-warrior";

export function WarriorProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<State>({ profile: null, missions: [], labScore: null, prediction: null });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setS(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {}
  }, [s]);

  const complete = (m: Mission) =>
    setS((p) => (p.missions.includes(m) ? p : { ...p, missions: [...p.missions, m] }));
  const xp = MISSIONS.filter((m) => s.missions.includes(m.id)).reduce((a, m) => a + m.xp, 0);

  return (
    <C.Provider
      value={{
        ...s,
        xp,
        complete,
        setProfile: (profile) => setS((p) => ({ ...p, profile, missions: p.missions.includes("profile") ? p.missions : [...p.missions, "profile"] })),
        setLabScore: (labScore) => setS((p) => ({ ...p, labScore: Math.max(labScore, p.labScore ?? 0) })),
        setPrediction: (prediction) => setS((p) => ({ ...p, prediction })),
      }}
    >
      {children}
    </C.Provider>
  );
}

export function useWarrior() {
  const c = useContext(C);
  if (!c) throw new Error("useWarrior outside provider");
  return c;
}

export function rankFor(xp: number) {
  if (xp >= 700) return "Gorkha Captain";
  if (xp >= 450) return "Elite Warrior";
  if (xp >= 200) return "Warrior";
  return "Recruit";
}

/* ---------- "Meet your Gorkha" — deterministic generator.
   Swap `generateArchetype` for a server function calling an AI model later. */
const ARCH: Record<string, { title: string; line: string }> = {
  Attack: { title: "Calculated Attacker", line: "You don't chase every opportunity. You wait for the right moment, then go all in." },
  Defend: { title: "Unbreakable Wall", line: "Pressure finds you and leaves empty-handed. You make the opposition earn every inch." },
  Adapt: { title: "Shape-Shifter", line: "You read the pitch before anyone else. When the game changes, you've already changed with it." },
  Lead: { title: "Born Commander", line: "Others look to you when the over gets tight. You set the field, and the field follows." },
};
const PLACE: Record<string, string> = {
  Kathmandu: "Valley", Lalitpur: "Patan", Bhaktapur: "Bhadgaon", Nuwakot: "Hilltop", "Beyond the Valley": "Diaspora",
};
export async function generateArchetype(p: Profile) {
  await new Promise((r) => setTimeout(r, 2200));
  const a = ARCH[p.style] ?? ARCH.Attack;
  const role = p.role.replace("The ", "");
  return {
    archetype: `The ${PLACE[p.city] ?? "Valley"} ${role}`,
    trait: a.title,
    line: `You're a ${a.title.toLowerCase()}. ${a.line}`,
  };
}

export function makeId(name: string) {
  let h = 0;
  for (const ch of name + Date.now()) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return `KG-12-${String(h % 100000).padStart(5, "0")}`;
}
