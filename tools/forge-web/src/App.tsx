import {
  BookOpenText,
  ChartNoAxesColumnIncreasing,
  ChevronLeft,
  ChevronRight,
  Flame,
  LayoutDashboard,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { api } from "./api";
import { Dashboard } from "./components/Dashboard";
import { PomodoroWidget } from "./components/PomodoroWidget";
import { ProgressView } from "./components/ProgressView";
import { ThemeToggle } from "./components/ThemeToggle";
import { UnitView } from "./components/UnitView";
import { Button } from "./components/ui/8bit/button";
import { sfx } from "./lib/sound";
import type { DashboardData } from "./types";

type Page = "dashboard" | "unit" | "progress";

const navigation = [
  { id: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
  { id: "unit" as const, label: "Unidade", icon: BookOpenText },
  { id: "progress" as const, label: "Progresso", icon: ChartNoAxesColumnIncreasing },
];

export function App() {
  const [page, setPage] = useState<Page>("dashboard");
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem("forge-sidebar-collapsed") === "1",
  );
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    localStorage.setItem("forge-sidebar-collapsed", collapsed ? "1" : "0");
  }, [collapsed]);

  const isFirstPage = useRef(true);
  useEffect(() => {
    if (isFirstPage.current) {
      isFirstPage.current = false;
      return;
    }
    setTransitioning(true);
    const id = setTimeout(() => setTransitioning(false), 280);
    return () => clearTimeout(id);
  }, [page]);

  const refresh = useCallback(async () => {
    try {
      setData(await api.dashboard());
      setError("");
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Não foi possível carregar o Forge.",
      );
    }
  }, []);

  useEffect(() => {
    let active = true;
    api
      .dashboard()
      .then((dashboard) => {
        if (active) setData(dashboard);
      })
      .catch((caught) => {
        if (active)
          setError(
            caught instanceof Error
              ? caught.message
              : "Não foi possível carregar o Forge.",
          );
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      const clickable = target?.closest("button, a, summary, select, [role='switch']");
      if (!clickable) return;
      if (clickable.closest(".pomodoro-widget, .pomodoro-fullscreen")) return;
      sfx.click();
    }
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  async function selectUnit(unitId: string) {
    await api.focus(unitId);
    await refresh();
    setPage("unit");
  }

  if (error) {
    return (
      <main className="fatal-state">
        <Flame size={28} />
        <h1>O Forge não iniciou corretamente</h1>
        <p>{error}</p>
        <Button variant="secondary" onClick={refresh}>
          Tentar novamente
        </Button>
      </main>
    );
  }

  if (!data)
    return (
      <main className="boot-state">
        <Flame size={30} />
        <span>Preparando seu Forge...</span>
      </main>
    );

  return (
    <div className={`app-shell ${collapsed ? "sidebar-collapsed" : ""}`}>
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">
            <Flame size={20} fill="currentColor" />
          </span>
          <div>
            <strong>Backend Engineering</strong>
            <span>Forge</span>
          </div>
        </div>
        <nav aria-label="Navegação principal">
          {navigation.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={page === id ? "active" : ""}
              onClick={() => setPage(id)}
            >
              <Icon size={19} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-foot">
          <span>Fase {data.currentUnit.phase}</span>
          <strong>{data.currentUnit.id.toUpperCase()}</strong>
        </div>
        <button
          className="sidebar-collapse-toggle"
          onClick={() => setCollapsed((value) => !value)}
          aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </aside>

      <div className="content-shell">
        <header className="topbar">
          <div>
            <span>{pageLabel(page)}</span>
            {page !== "dashboard" && <ChevronRight size={14} />}
            {page !== "dashboard" && (
              <strong>
                {page === "unit" ? data.currentUnit.id.toUpperCase() : pageLabel(page)}
              </strong>
            )}
          </div>
          <div className="topbar-actions">
            <ThemeToggle />
          </div>
        </header>

        <main className="main-content">
          {transitioning && (
            <div className="page-transition-overlay" aria-hidden="true" />
          )}
          {page === "dashboard" && (
            <Dashboard
              key="dashboard"
              data={data}
              onContinue={() => setPage("unit")}
              onRefresh={refresh}
            />
          )}
          {page === "unit" && (
            <UnitView key="unit" unitId={data.currentUnit.id} onChanged={refresh} />
          )}
          {page === "progress" && (
            <ProgressView key="progress" data={data} onSelect={selectUnit} />
          )}
        </main>
      </div>

      <nav className="mobile-nav" aria-label="Navegação móvel">
        {navigation.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={page === id ? "active" : ""}
            onClick={() => setPage(id)}
          >
            <Icon size={19} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <PomodoroWidget unitId={data.currentUnit.id} onLogged={refresh} />
    </div>
  );
}

function pageLabel(page: Page) {
  return navigation.find((item) => item.id === page)?.label || "Dashboard";
}
