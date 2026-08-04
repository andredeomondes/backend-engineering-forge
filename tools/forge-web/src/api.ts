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
  revealHint: (unitId: string, level: number) =>
    request<import("./types").UnitDetail>(`/api/units/${unitId}/hints/${level}`, {
      method: "POST",
    }),
  test: (unitId: string) =>
    request<{ result: import("./types").TestResult; unit: import("./types").UnitDetail }>(
      `/api/units/${unitId}/tests`,
      { method: "POST" },
    ),
  reflect: (unitId: string, reflection: string, confidence: number) =>
    request<import("./types").UnitDetail>(`/api/units/${unitId}/reflection`, {
      method: "POST",
      body: JSON.stringify({ reflection, confidence }),
    }),
  reviews: () => request<import("./types").Review[]>("/api/reviews"),
  completeReview: (reviewId: number, confidence: number) =>
    request<import("./types").Review[]>(`/api/reviews/${reviewId}/complete`, {
      method: "POST",
      body: JSON.stringify({ confidence }),
    }),
};
