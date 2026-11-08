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
    status: "completed" | "active" | "available";
  }>;
  polyglotTracks: Array<{
    id: "java" | "dotnet" | "go";
    title: string;
    modules: string;
    status: "available";
  }>;
};

export type MissionDetail = {
  objective: string;
  uses?: string;
  example?: { input: string; output: string };
  rules: string[];
  pitfalls: string[];
};

export type Exercise = {
  index: number;
  id: string;
  name: string;
  group: string;
  summary: string;
  detail: MissionDetail | null;
};

export type MissionStatus = "todo" | "failing" | "passed" | "manual";

export type Mission = {
  index: number;
  id: string;
  name: string;
  group: string;
  status: MissionStatus;
};

export type UnitDetail = UnitSummary & {
  markdown: string;
  /** Workspace-relative path with "/" (for the copyable command). */
  testPath: string;
  /** False for units without per-mission tests (SQL). */
  missionTestable: boolean;
  exercises: Exercise[];
  missions: Mission[];
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
  gate: { tests: boolean; reflection: boolean; completed: boolean; badge: boolean };
};

export type TestResult = {
  success: boolean;
  passed: number;
  failed: number;
  total: number;
  durationMs: number;
  output: string;
};

export type TestResponse = { result: TestResult; unit: UnitDetail; noTests: boolean };

export type TrailLevelId = "lv1" | "lv2" | "lv3" | "lv4";

export type TrailItem = {
  id: string;
  label: string;
  kind: "unit" | "topic";
  done: boolean;
  unitId?: string;
};

export type TrailNode = {
  id: string;
  kind: "phase" | "java" | "dsa";
  phase: number | null;
  level: TrailLevelId | null;
  title: string;
  shortTitle: string;
  who: string;
  becomes: string;
  percent: number;
  state: "done" | "current" | "todo";
  items: TrailItem[];
};

export type TrailData = {
  sheet: {
    className: "Backend Dev";
    level: { id: string; name: string };
    nextLevel: { id: string; name: string; firstPhase: number } | null;
    xpPercent: number;
    phasesDone: number;
    phasesTotal: 27;
    unitsDone: number;
    unitsTotal: number;
    currentPhase: number;
    currentUnitId: string;
    remainingInPhase: number;
    java: { percent: number };
    dsa: { percent: number };
  };
  levels: Array<{ id: TrailLevelId; name: string; phases: number[] }>;
  nodes: TrailNode[];
};
