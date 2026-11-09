import { useEffect, useState } from "react";

export const HERO_CLASSES = [
  { id: "knight_m", label: "Cavaleiro" },
  { id: "wizzard_m", label: "Mago" },
  { id: "elf_f", label: "Elfa" },
  { id: "lizard_m", label: "Lagarto" },
] as const;

export type HeroId = (typeof HERO_CLASSES)[number]["id"];

const KEY = "forge-hero";
const EVENT = "forge-hero-change";

function read(): HeroId {
  try {
    const saved = localStorage.getItem(KEY);
    if (HERO_CLASSES.some((h) => h.id === saved)) return saved as HeroId;
  } catch {
    /* storage indisponível: usa o padrão */
  }
  return "knight_m";
}

/** Classe visual do herói, salva no navegador e sincronizada entre telas. */
export function useHero() {
  const [hero, setHero] = useState<HeroId>(read);

  useEffect(() => {
    const sync = () => setHero(read());
    window.addEventListener(EVENT, sync);
    return () => window.removeEventListener(EVENT, sync);
  }, []);

  function cycle() {
    const index = HERO_CLASSES.findIndex((h) => h.id === hero);
    const next = HERO_CLASSES[(index + 1) % HERO_CLASSES.length].id;
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* ignora */
    }
    setHero(next);
    window.dispatchEvent(new Event(EVENT));
  }

  const label = HERO_CLASSES.find((h) => h.id === hero)?.label ?? "Cavaleiro";
  return { hero, label, cycle };
}
