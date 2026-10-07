import { useEffect, useRef, useState, type ReactNode, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function KhukuriMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden>
      <defs>
        <linearGradient id="kg-g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="var(--gold-soft)" />
          <stop offset="1" stopColor="var(--gold)" />
        </linearGradient>
      </defs>
      <g fill="url(#kg-g)">
        <path d="M22 98 C40 70 62 44 96 20 C92 34 80 52 66 64 C54 74 40 86 30 104 Z" />
        <path d="M98 98 C80 70 58 44 24 20 C28 34 40 52 54 64 C66 74 80 86 90 104 Z" opacity=".85" />
        <rect x="16" y="96" width="18" height="7" rx="2" transform="rotate(-38 25 99)" />
        <rect x="86" y="96" width="18" height="7" rx="2" transform="rotate(38 95 99)" />
      </g>
      <circle cx="60" cy="60" r="56" fill="none" stroke="url(#kg-g)" strokeWidth="1.5" opacity=".5" />
    </svg>
  );
}

export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (el.classList.add("in"), io.disconnect()), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={cn("reveal", className)} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export function SectionHead({ num, eyebrow, title, sub }: { num: string; eyebrow: string; title: ReactNode; sub?: string }) {
  return (
    <Reveal className="mb-12 md:mb-16">
      <div className="flex items-center gap-4">
        <span className="font-display text-sm font-bold text-muted-foreground">{num}</span>
        <span className="h-px w-10 bg-gold" />
        <span className="eyebrow">{eyebrow}</span>
      </div>
      <h2 className="display mt-5 text-5xl sm:text-6xl md:text-8xl">{title}</h2>
      {sub && <p className="mt-5 max-w-xl text-base text-muted-foreground md:text-lg">{sub}</p>}
    </Reveal>
  );
}

export function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / 1400);
        setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  return <span ref={ref}>{n}{suffix}</span>;
}

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "gold" | "ghost" | "outline" };
export function Btn({ variant = "gold", className, children, ...rest }: BtnProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.15}px, ${(e.clientY - r.top - r.height / 2) * 0.25}px)`;
  };
  return (
    <button
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => ref.current && (ref.current.style.transform = "")}
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 rounded-sm px-7 py-4 text-xs font-extrabold uppercase tracking-[0.22em] transition-[transform,box-shadow,background,color] duration-300 disabled:pointer-events-none disabled:opacity-40",
        variant === "gold" && "bg-gold-gradient text-primary-foreground hover:shadow-gold",
        variant === "outline" && "border border-gold/50 text-gold hover:bg-gold hover:text-primary-foreground",
        variant === "ghost" && "text-foreground/80 hover:text-gold",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export function Prototype({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-sm border border-gold/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-gold", className)}>
      <span className="size-1.5 rounded-full bg-gold" /> Prototype
    </span>
  );
}

export function Chip({ active, children, onClick }: { active?: boolean; children: ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-sm border px-4 py-3 text-left text-sm font-semibold transition-all duration-300",
        active ? "border-gold bg-gold/10 text-gold shadow-gold" : "border-border bg-secondary/40 text-foreground/80 hover:border-gold/40",
      )}
    >
      {children}
    </button>
  );
}