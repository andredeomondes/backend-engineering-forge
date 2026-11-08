async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "A operação não foi concluída.");
  return data;
}

export const api = {
  dashboard: () => request<import("./types").DashboardData>("/api/dashboard"),
  unit: (unitId: string) => request<import("./types").UnitDetail>(`/api/units/${unitId}`),
  focus: (unitId: string) =>
    request<import("./types").UnitDetail>("/api/focus", {
      method: "POST",
      body: JSON.stringify({ unitId }),
    }),
  session: (input: Record<string, unknown>) =>
    request<import("./types").Session>("/api/study-sessions", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  deleteSession: (id: number) =>
    request<{ id: number }>(`/api/study-sessions/${id}`, { method: "DELETE" }),
  revealHint: (unitId: string, level: number) =>
    request<import("./types").UnitDetail>(`/api/units/${unitId}/hints/${level}`, {
      method: "POST",
    }),
  test: (unitId: string, exerciseId?: string) =>
    request<import("./types").TestResponse>(`/api/units/${unitId}/tests`, {
      method: "POST",
      body: JSON.stringify({ exerciseId }),
    }),
  markMission: (unitId: string, exerciseId: string, done: boolean) =>
    request<import("./types").UnitDetail>(
      `/api/units/${unitId}/missions/${encodeURIComponent(exerciseId)}`,
      { method: "POST", body: JSON.stringify({ done }) },
    ),
  markAllMissions: (unitId: string) =>
    request<import("./types").UnitDetail>(`/api/units/${unitId}/missions`, {
      method: "POST",
    }),
  saveReflection: (unitId: string, reflection: string, confidence: number) =>
    request<import("./types").UnitDetail>(`/api/units/${unitId}/reflection`, {
      method: "POST",
      body: JSON.stringify({ reflection, confidence }),
    }),
  trail: () => request<import("./types").TrailData>("/api/trail"),
  trailItem: (itemId: string, done: boolean) =>
    request<import("./types").TrailData>(
      `/api/trail/items/${encodeURIComponent(itemId)}`,
      { method: "POST", body: JSON.stringify({ done }) },
    ),
  trailNodeComplete: (nodeId: string) =>
    request<import("./types").TrailData>(
      `/api/trail/nodes/${encodeURIComponent(nodeId)}/complete`,
      { method: "POST" },
    ),
};
