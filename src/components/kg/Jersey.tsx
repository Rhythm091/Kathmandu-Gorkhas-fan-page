import { useEffect, useRef, useState } from "react";
import { Bell, MessageCircle, X } from "lucide-react";
import { Btn, SectionHead } from "./primitives";
import jerseyFront from "@/assets/jersey-home.jpg";
import jerseyBack from "@/assets/jersey-home-back.jpg";
import { useWarrior } from "@/lib/warrior";
import { cn } from "@/lib/utils";

const WHATSAPP_NUMBER = "9779829700542";

export function Jersey() {
  const { profile, complete } = useWarrior();

  const [side, setSide] = useState<"front" | "back">("front");
  const [num, setNum] = useState(12);
  const [name, setName] = useState("");
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const [notifyOpen, setNotifyOpen] = useState(false);
  const [whatsapp, setWhatsapp] = useState("");
  const [notified, setNotified] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          complete("jersey");
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );

    io.observe(el);

    return () => io.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const shown = (name || profile?.name || "WARRIOR")
    .toUpperCase()
    .slice(0, 12);

  const handleSideChange = (newSide: "front" | "back") => {
    if (newSide === side) return;

    setSide(newSide);
    setTilt({ x: 0, y: 0 });
  };

  const openNotify = () => {
    setNotifyOpen(true);
  };

  const closeNotify = () => {
    setNotifyOpen(false);
  };

  const sendWhatsApp = () => {
    const cleanNumber = whatsapp.replace(/\D/g, "");

    if (!cleanNumber) return;

    const message = [
      "🏔️ KATHMANDU GORKHAS · JERSEY",
      "",
      "I want to be notified when the Kathmandu Gorkhas jersey launches.",
      "",
      `Name: ${shown}`,
      `Jersey Number: ${num}`,
      `WhatsApp: +${cleanNumber}`,
      "",
      "Three Cities. One Soul.",
    ].join("\n");

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message,
    )}`;

    window.open(url, "_blank", "noopener,noreferrer");

    setNotified(true);
    setNotifyOpen(false);
  };

  return (
    <section
      id="kit"
      className="relative overflow-hidden bg-royal-glow py-24 md:py-36"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHead
          num="05"
          eyebrow="Jersey · Coming soon"
          title={
            <>
              Wear the{" "}
              <span className="text-gold-gradient">Valley.</span>
            </>
          }
          sub="Concept jersey for presentation only — not an official design."
        />

        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* JERSEY PREVIEW */}
          <div
            ref={ref}
            className="relative mx-auto w-full max-w-md [perspective:1400px]"
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();

              setTilt({
                x:
                  ((e.clientY - r.top) / r.height - 0.5) * -8,
                y:
                  ((e.clientX - r.left) / r.width - 0.5) * 12,
              });
            }}
            onMouseLeave={() => setTilt({ x: 0, y: 0 })}
          >
            {/* GLOW */}
            <div
              className={cn(
                "absolute inset-12 rounded-full bg-gold blur-3xl transition-all duration-1000",
                side === "back"
                  ? "scale-105 opacity-25"
                  : "opacity-20",
              )}
            />

            {/* 3D JERSEY */}
            <div
              className="relative [transform-style:preserve-3d]"
              style={{
                transform: `
                  rotateX(${tilt.x}deg)
                  rotateY(${tilt.y + (side === "back" ? 180 : 0)}deg)
                  scale(${side === "back" ? 0.985 : 1})
                `,
                transition:
                  "transform 900ms cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              {/* FRONT */}
              <div className="relative overflow-hidden rounded-lg [backface-visibility:hidden]">
                <img
                  src={jerseyFront}
                  alt="Kathmandu Gorkhas concept jersey front"
                  width={1024}
                  height={1280}
                  loading="lazy"
                  className="block w-full"
                />

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-50" />
              </div>

              {/* BACK */}
              <div
                className="absolute inset-0 overflow-hidden rounded-lg [backface-visibility:hidden]"
                style={{
                  transform: "rotateY(180deg)",
                }}
              >
                <img
                  src={jerseyBack}
                  alt="Kathmandu Gorkhas concept jersey back"
                  width={1024}
                  height={1280}
                  loading="lazy"
                  className="block h-full w-full object-cover"
                />

                {/* CUSTOM NAME + NUMBER */}
                <div className="absolute inset-0 flex flex-col items-center pt-[30%]">
                  <span className="display text-3xl tracking-[0.15em] text-gold md:text-4xl">
                    {shown}
                  </span>

                  <span className="display text-[9rem] leading-none text-gold md:text-[11rem]">
                    {num}
                  </span>
                </div>

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-40" />
              </div>
            </div>
          </div>

          {/* CONTROLS */}
          <div>
            {/* SINGLE JERSEY LABEL */}
            <div className="rounded-sm border border-gold bg-gold px-5 py-4 text-center text-xs font-extrabold uppercase tracking-[0.22em] text-primary-foreground">
              Jersey
            </div>

            {/* FRONT / BACK */}
            <div className="mt-3 flex gap-2">
              {(["front", "back"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => handleSideChange(s)}
                  className={cn(
                    "relative flex-1 overflow-hidden rounded-sm border px-5 py-3 text-xs font-bold uppercase tracking-[0.22em] transition-all duration-300",
                    side === s
                      ? "border-gold bg-gold/10 text-gold"
                      : "border-border text-muted-foreground hover:border-gold/40 hover:text-foreground",
                  )}
                >
                  {side === s && (
                    <span className="absolute inset-x-0 bottom-0 h-px bg-gold shadow-[0_0_10px_var(--gold)]" />
                  )}

                  {s}
                </button>
              ))}
            </div>

            {/* NAME */}
            <label className="mt-8 block">
              <span className="eyebrow">Name on back</span>

              <input
                value={name}
                maxLength={12}
                onFocus={() => handleSideChange("back")}
                onChange={(e) => setName(e.target.value)}
                placeholder={profile?.name ?? "WARRIOR"}
                className="mt-3 w-full border-b-2 border-border bg-transparent pb-2 font-display text-3xl font-bold uppercase outline-none transition-colors focus:border-gold"
              />
            </label>

            {/* NUMBER */}
            <div className="mt-8">
              <span className="eyebrow">
                Number · {num}
              </span>

              <input
                type="range"
                min={1}
                max={99}
                value={num}
                onChange={(e) => {
                  setNum(+e.target.value);
                  handleSideChange("back");
                }}
                className="mt-4 w-full accent-[var(--gold)]"
              />
            </div>

            {/* NOTIFY BUTTON */}
            <Btn
              className="mt-10 w-full sm:w-auto"
              onClick={openNotify}
              disabled={notified}
            >
              <Bell className="size-4" />

              {notified
                ? "You're on the list"
                : "Notify me at launch"}
            </Btn>
          </div>
        </div>
      </div>

      {/* WHATSAPP MODAL */}
      {notifyOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-5 backdrop-blur-md"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closeNotify();
            }
          }}
        >
          <div className="relative w-full max-w-md overflow-hidden rounded-lg border border-gold/30 bg-card shadow-royal">
            {/* GOLD GLOW */}
            <div className="pointer-events-none absolute -right-20 -top-20 size-48 rounded-full bg-gold/10 blur-3xl" />

            <div className="relative p-7 md:p-8">
              {/* HEADER */}
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="eyebrow">Jersey launch</p>

                  <h3 className="display mt-3 text-4xl">
                    Stay in the{" "}
                    <span className="text-gold-gradient">
                      loop.
                    </span>
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    We'll send your launch request straight to
                    WhatsApp.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeNotify}
                  aria-label="Close"
                  className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-gold hover:text-gold"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* AUTO-FILLED DETAILS */}
              <div className="mt-7 grid grid-cols-2 gap-3">
                <div className="rounded-sm border border-border bg-secondary/30 p-4">
                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    Warrior
                  </p>

                  <p className="mt-2 truncate font-display text-xl font-bold uppercase">
                    {shown}
                  </p>
                </div>

                <div className="rounded-sm border border-border bg-secondary/30 p-4">
                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    Jersey
                  </p>

                  <p className="mt-2 font-display text-xl font-bold text-gold">
                    #{num}
                  </p>
                </div>
              </div>

              {/* WHATSAPP NUMBER */}
              <label className="mt-6 block">
                <span className="eyebrow">
                  Your WhatsApp number
                </span>

                <div className="mt-3 flex items-center border-b-2 border-border transition-colors focus-within:border-gold">
                  <span className="pr-3 font-semibold text-muted-foreground">
                    +977
                  </span>

                  <input
                    type="tel"
                    inputMode="numeric"
                    value={whatsapp}
                    onChange={(e) =>
                      setWhatsapp(
                        e.target.value.replace(/\D/g, "").slice(0, 10),
                      )
                    }
                    placeholder="98XXXXXXXX"
                    className="w-full bg-transparent py-2 font-mono text-lg outline-none"
                  />
                </div>
              </label>

              {/* SEND */}
              <button
                type="button"
                onClick={sendWhatsApp}
                disabled={whatsapp.replace(/\D/g, "").length < 7}
                className="mt-7 flex w-full items-center justify-center gap-3 rounded-sm bg-gold px-6 py-4 text-xs font-extrabold uppercase tracking-[0.2em] text-primary-foreground transition-all duration-300 hover:shadow-gold disabled:pointer-events-none disabled:opacity-40"
              >
                <MessageCircle className="size-4" />
                Send on WhatsApp
              </button>

              <p className="mt-4 text-center text-[10px] leading-relaxed text-muted-foreground">
                WhatsApp will open with your details already
                filled in. Just press Send.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}