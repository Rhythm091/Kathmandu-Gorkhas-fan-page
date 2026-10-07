import { useLayoutEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { WarriorProvider } from "@/lib/warrior";
import { Loader, Nav } from "@/components/kg/Shell";
import { Hero } from "@/components/kg/Hero";
import { Valley } from "@/components/kg/Valley";
import { Warrior } from "@/components/kg/Warrior";
import { Lab } from "@/components/kg/Lab";
import { Oracle } from "@/components/kg/Oracle";
import { Jersey } from "@/components/kg/Jersey";
import { Story } from "@/components/kg/Story";
import { Final, Memory, Progress, Sponsor } from "@/components/kg/Finale";

const TITLE = "Kathmandu Gorkhas — Become the 12th Warrior";

const DESC =
  "Three Cities. One Soul. An interactive fan experience for the Kathmandu Gorkhas of the Nepal Premier League.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],

    links: [
      {
        rel: "icon",
        type: "image/png",
        href: "/logo.png",
      },
    ],
  }),

  component: Index,
});

function Index() {
  useLayoutEffect(() => {
    // Prevent the browser from restoring the previous scroll position.
    window.history.scrollRestoration = "manual";

    // Start exactly at the top of the Hero.
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });

    // Some browsers restore scroll after the first paint,
    // so force it once more on the next frame.
    const frame = window.requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <WarriorProvider>
      <Loader />

      <Nav />

      <main>
        <Hero />

        <Valley />

        <Warrior />

        <Lab />

        <Oracle />

        <Jersey />

        <Story />

        <Progress />

        <Memory />

        <Sponsor />
      </main>

      <Final />
    </WarriorProvider>
  );
}
