import { useEffect, useRef, useState } from "react";
import { ArrowDown, Volume2, VolumeX } from "lucide-react";
import { Btn, Prototype } from "./primitives";

const ANTHEM_SRC =
  "/Kathmandu%20Gorkhas%20Anthem%20-%20The%20Elements.mp3";

export function Hero() {
  const img = useRef<HTMLImageElement>(null);
  const frame = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Music is ON by default.
  const [muted, setMuted] = useState(false);

  /* HERO PARALLAX */
  useEffect(() => {
    const updateParallax = () => {
      if (img.current) {
        const y = window.scrollY * 0.12;

        img.current.style.transform = `translate3d(0, ${y}px, 0) scale(1.08)`;
      }

      frame.current = null;
    };

    const onScroll = () => {
      if (frame.current === null) {
        frame.current = requestAnimationFrame(updateParallax);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    updateParallax();

    return () => {
      window.removeEventListener("scroll", onScroll);

      if (frame.current !== null) {
        cancelAnimationFrame(frame.current);
      }
    };
  }, []);

  /* ANTHEM */
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.volume = 0.65;
    audio.loop = true;
    audio.muted = false;

    const startAnthem = async () => {
      try {
        // Default behavior: start music with sound.
        await audio.play();

        setMuted(false);
      } catch {
        try {
          audio.muted = true;
          await audio.play();

          setMuted(true);
        } catch (error) {
          console.error("Could not start Gorkhas anthem:", error);
        }
      }
    };

    startAnthem();

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  const toggleMute = async () => {
    const audio = audioRef.current;

    if (!audio) return;

    if (audio.muted) {
      audio.muted = false;
      setMuted(false);

      if (audio.paused) {
        try {
          await audio.play();
        } catch (error) {
          console.error("Could not play anthem:", error);
        }
      }
    } else {
      audio.muted = true;
      setMuted(true);
    }
  };

  return (
    <section
      id="top"
      className="grain relative flex min-h-[100svh] items-end overflow-hidden"
    >
      {/* BACKGROUND ANTHEM */}
      <audio
        ref={audioRef}
        src={ANTHEM_SRC}
        preload="auto"
        loop
      />

      {/* HERO IMAGE */}
      <img
        ref={img}
        src="src/assets/hero-valley.jpg"
        alt="Kathmandu Durbar Square temples beneath the Himalaya at dusk"
        width={1920}
        height={1088}
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover will-change-transform"
      />

      {/* OVERLAYS */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/35 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/55 via-background/10 to-transparent" />
      <div className="absolute inset-0 bg-black/5" />

      {/* HERO CONTENT */}
      <div className="relative mx-auto w-full max-w-7xl px-5 pb-16 pt-32 md:px-8 md:pb-24">
        <div
          className="hero-item flex flex-wrap items-center gap-3"
          style={{ animationDelay: "0.15s" }}
        >
          <span className="eyebrow">
            Nepal Premier League · Kathmandu Valley
          </span>
        </div>

        <h1 className="display mt-6 text-[17vw] sm:text-[13vw] lg:text-[11rem]">
          <span
            className="hero-item block"
            style={{ animationDelay: "0.25s" }}
          >
            Three Cities.
          </span>

          <span
            className="hero-item block text-gold-gradient"
            style={{ animationDelay: "0.4s" }}
          >
            One Soul.
          </span>
        </h1>

        <p
          className="hero-item mt-6 max-w-md text-base text-foreground/80 md:text-lg"
          style={{ animationDelay: "0.55s" }}
        >
          Kathmandu. Lalitpur. Bhaktapur. One team, one dream — and a place in
          the stands with your name on it.
        </p>

        <div
          className="hero-item mt-10 flex flex-wrap items-center gap-6"
          style={{ animationDelay: "0.7s" }}
        >
          <a href="#valley">
            <Btn>Enter the Gorkhas</Btn>
          </a>

          <a
            href="#warrior"
            className="text-xs font-bold uppercase tracking-[0.22em] text-foreground/70 underline-offset-8 transition-colors hover:text-gold hover:underline"
          >
            Become the 12th Warrior
          </a>
        </div>
      </div>

      {/* BOTTOM-RIGHT CONTROLS */}
      <div className="absolute bottom-6 right-6 z-20 flex items-center gap-3">
        {/* SCROLL */}
        <a
          href="#valley"
          aria-label="Scroll to the Valley"
          className="group hidden size-10 items-center justify-center rounded-full border border-gold/20 bg-background/25 text-gold/70 backdrop-blur-md transition-all duration-300 hover:border-gold/50 hover:bg-background/50 hover:text-gold hover:scale-105 md:flex"
        >
          <ArrowDown className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" />
        </a>

        {/* VOLUME */}
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Unmute Gorkhas anthem" : "Mute Gorkhas anthem"}
          title={muted ? "Unmute anthem" : "Mute anthem"}
          className="group relative flex size-10 items-center justify-center rounded-full border border-gold/25 bg-background/35 text-gold backdrop-blur-md transition-all duration-300 hover:border-gold/60 hover:bg-background/60 hover:text-gold hover:scale-105 hover:shadow-[0_0_20px_-8px_var(--gold)]"
        >
          {muted ? (
            <VolumeX className="size-[15px] opacity-80 transition-opacity group-hover:opacity-100" />
          ) : (
            <Volume2 className="size-[15px] transition-transform duration-300 group-hover:scale-110" />
          )}

          {/* Music active indicator */}
          {!muted && (
            <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-gold shadow-[0_0_8px_var(--gold)]" />
          )}
        </button>
      </div>

      {/* HERO ANIMATION */}
      <style>{`
        .hero-item {
          opacity: 0;
          transform: translate3d(0, 18px, 0);
          animation: heroRise 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes heroRise {
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-item {
            opacity: 1;
            transform: none;
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
