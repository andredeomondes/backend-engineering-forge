import { useEffect, useState } from "react";

/** Animated pixel-art sprite from /sprites (0x72 DungeonTileset II frames). */
type Props = {
  name: string;
  anim?: "idle" | "run" | "open" | "";
  frames?: number;
  width: number;
  height: number;
  scale?: number;
  fps?: number;
  className?: string;
  label?: string;
};

const reduceMotion =
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

function frameSrc(name: string, anim: Props["anim"], index: number, frames: number) {
  if (frames <= 1) return `/sprites/${name}.png`;
  const suffix = anim ? `_${anim}_anim_f${index}` : `_anim_f${index}`;
  return `/sprites/${name}${suffix}.png`;
}

export function Sprite({
  name,
  anim = "idle",
  frames = 4,
  width,
  height,
  scale = 3,
  fps = 6,
  className = "",
  label,
}: Props) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    for (let i = 0; i < frames; i += 1) {
      const img = new Image();
      img.src = frameSrc(name, anim, i, frames);
    }
  }, [name, anim, frames]);

  useEffect(() => {
    if (frames <= 1 || reduceMotion) return;
    const id = setInterval(() => setFrame((f) => (f + 1) % frames), 1000 / fps);
    return () => clearInterval(id);
  }, [frames, fps]);

  return (
    <img
      className={`sprite ${className}`}
      src={frameSrc(name, anim, frame % frames, frames)}
      width={width * scale}
      height={height * scale}
      alt={label ?? ""}
      aria-hidden={label ? undefined : true}
      draggable={false}
    />
  );
}
