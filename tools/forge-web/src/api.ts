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
  test: (unitId: string, exerciseName?: string) =>
    request<{ result: import("./types").TestResult; unit: import("./types").UnitDetail }>(
      `/api/units/${unitId}/tests`,
      { method: "POST", body: JSON.stringify({ exerciseName }) },
    ),
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
