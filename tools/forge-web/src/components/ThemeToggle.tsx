import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { Switch } from "@/components/ui/8bit/switch";

function getInitialTheme(): boolean {
  const stored = localStorage.getItem("forge-theme");
  if (stored) return stored === "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function ThemeToggle() {
  const [dark, setDark] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("forge-theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <label className="flex items-center gap-2 text-muted-foreground">
      <Sun size={15} />
      <Switch
        checked={dark}
        onCheckedChange={setDark}
        aria-label="Alternar tema escuro"
      />
      <Moon size={15} />
    </label>
  );
}
