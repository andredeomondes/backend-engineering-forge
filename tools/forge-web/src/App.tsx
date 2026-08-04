import {
  BookOpenText,
  ChartNoAxesColumnIncreasing,
  ChevronRight,
  Flame,
  LayoutDashboard,
  RefreshCw,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { api } from "./api";
import { Dashboard } from "./components/Dashboard";
import { ProgressView } from "./components/ProgressView";
import { ReviewsView } from "./components/ReviewsView";
import { UnitView } from "./components/UnitView";
import type { DashboardData } from "./types";

type Page = "dashboard" | "unit" | "reviews" | "progress";

const navigation = [
  { id: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
  { id: "unit" as const, label: "Unidade", icon: BookOpenText },
  { id: "reviews" as const, label: "Revisões", icon: RefreshCw },
  { id: "progress" as const, label: "Progresso", icon: ChartNoAxesColumnIncreasing },
];

export function App() {
  const [page, setPage] = useState<Page>("dashboard");
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    try {
      setData(await api.dashboard());
      setError("");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Não foi possível carregar o Forge.");
    }
  }, []);

  useEffect(() => {
    let active = true;
    api.dashboard()
      .then((dashboard) => {
        if (active) setData(dashboard);
      })
      .catch((caught) => {
        if (active) setError(caught instanceof Error ? caught.message : "Não foi possível carregar o Forge.");
      });
    return () => {
      active = false;
    };
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
        <button className="secondary-button" onClick={refresh}>Tentar novamente</button>
      </main>
    );
  }

  if (!data) return <main className="boot-state"><Flame size={30} /><span>Preparando seu Forge...</span></main>;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark"><Flame size={20} fill="currentColor" /></span>
          <div><strong>Backend Engineering</strong><span>Forge</span></div>
        </div>
        <nav aria-label="Navegação principal">
          {navigation.map(({ id, label, icon: Icon }) => (
            <button key={id} className={page === id ? "active" : ""} onClick={() => setPage(id)}>
              <Icon size={19} /><span>{label}</span>
              {id === "reviews" && data.stats.dueReviews > 0 && <small>{data.stats.dueReviews}</small>}
            </button>
          ))}
        </nav>
        <div className="sidebar-foot">
          <span>Fase {data.currentUnit.phase}</span>
          <strong>{data.currentUnit.id.toUpperCase()}</strong>
        </div>
      </aside>

      <div className="content-shell">
        <header className="topbar">
          <div>
            <span>{pageLabel(page)}</span>
            {page !== "dashboard" && <ChevronRight size={14} />}
            {page !== "dashboard" && <strong>{page === "unit" ? data.currentUnit.id.toUpperCase() : pageLabel(page)}</strong>}
          </div>
          <div className="daily-status"><Flame size={16} /><strong>{data.stats.streak}</strong><span>dias</span></div>
        </header>

        <main className="main-content">
          {page === "dashboard" && <Dashboard data={data} onContinue={() => setPage("unit")} onRefresh={refresh} />}
          {page === "unit" && <UnitView unitId={data.currentUnit.id} onChanged={refresh} />}
          {page === "reviews" && <ReviewsView onChanged={refresh} />}
          {page === "progress" && <ProgressView data={data} onSelect={selectUnit} />}
        </main>
      </div>

      <nav className="mobile-nav" aria-label="Navegação móvel">
        {navigation.map(({ id, label, icon: Icon }) => (
          <button key={id} className={page === id ? "active" : ""} onClick={() => setPage(id)}>
            <Icon size={19} /><span>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

function pageLabel(page: Page) {
  return navigation.find((item) => item.id === page)?.label || "Dashboard";
}
