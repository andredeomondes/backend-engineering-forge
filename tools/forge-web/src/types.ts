export type UnitSummary = {
  id: string;
  track: "javascript" | "typescript" | "node" | "sql" | "dsa";
  phase: number;
  number: number;
  title: string;
  exerciseCount: number;
  estimatedHours: number;
  status: string;
  attempts: number;
  testsPassed: number;
  testsFailed: number;
  completedAt: string | null;
};

export type Session = {
  id: number;
  date: string;
  minutes: number;
  summary: string;
  difficulty: string;
  nextStep: string;
  unitId: string;
};

export type DashboardData = {
  currentUnit: UnitSummary;
  stats: {
    minutes: number;
    hours: number;
    days: number;
    streak: number;
    completedUnits: number;
    totalUnits: number;
    retention: number | null;
    autonomy: number | null;
    dueReviews: number;
  };
  recentSessions: Session[];
  units: UnitSummary[];
  projects: Array<{
    id: string;
    title: string;
    unlockAfter: string | null;
    status: string;
    markdown: string;
  }>;
  phases: Array<{
    number: number;
    title: string;
    label: string;
    status: "completed" | "active" | "locked";
  }>;
  polyglotTracks: Array<{
    id: "java" | "dotnet" | "go";
    title: string;
    modules: string;
    status: "locked";
  }>;
};

export type UnitDetail = UnitSummary & {
  markdown: string;
  exercises: Array<{ index: number; name: string }>;
  progress: {
    status: string;
    attempts: number;
    testsPassed: number;
    testsFailed: number;
    lastTestSuccess: number;
    reflection: string;
    confidence: number | null;
    helpLevel: number;
  };
  hints: Array<{ level: number; title: string; content: string; revealed: boolean }>;
  gate: { tests: boolean; reflection: boolean; confidence: boolean; completed: boolean };
};

export type Review = {
  id: number;
  unitId: string;
  unitTitle: string;
  cycleDays: number;
  scheduledFor: string;
  completedAt: string | null;
  confidence: number | null;
  due: boolean;
};

export type TestResult = {
  success: boolean;
  passed: number;
  failed: number;
  durationMs: number;
  output: string;
};
