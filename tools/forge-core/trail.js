// Pure trail computation: content + unit summaries + topic checks -> TrailData.
const PHASES_WITH_UNITS = new Set([1, 2, 3, 4, 12]);
const XP_PHASES = Array.from({ length: 28 }, (_, phase) => phase).filter(
  (phase) => phase !== 12,
);

function percentOf(done, total) {
  return total === 0 ? 0 : Math.round((100 * done) / total);
}

function average(values) {
  return values.length
    ? values.reduce((sum, value) => sum + value, 0) / values.length
    : 0;
}

export function buildNodeItems(node, units, checked) {
  if (node.phase !== null && PHASES_WITH_UNITS.has(node.phase)) {
    return units
      .filter((unit) => unit.phase === node.phase)
      .sort((a, b) => a.number - b.number)
      .map((unit) => ({
        id: unit.id,
        label: unit.title,
        kind: "unit",
        done: unit.status === "completed",
        unitId: unit.id,
      }));
  }
  return node.items.map((item) => ({
    id: item.id,
    label: item.label,
    kind: "topic",
    done: checked.has(item.id),
  }));
}

export function computeTrail({ content, units, checkedItemIds, currentUnitId }) {
  const checked = new Set(checkedItemIds);
  const currentUnit = units.find((unit) => unit.id === currentUnitId) || units[0];
  const currentPhase = currentUnit?.phase ?? 0;

  const built = content.nodes.map((node) => {
    const items = buildNodeItems(node, units, checked);
    const done = items.filter((item) => item.done).length;
    return { node, items, percent: percentOf(done, items.length) };
  });
  const byPhase = new Map(
    built.filter((entry) => entry.node.phase !== null).map((e) => [e.node.phase, e]),
  );

  const xpPhases = XP_PHASES.map((phase) => byPhase.get(phase)).filter(Boolean);
  const xpPercent = Math.round(average(xpPhases.map((entry) => entry.percent)));
  const phasesDone = xpPhases.filter((entry) => entry.percent === 100).length;

  const levelOfPhase = (phase) =>
    content.levels.find((level) => level.phases.includes(phase)) || null;
  let level = levelOfPhase(currentPhase);
  if (!level) {
    const pending = XP_PHASES.find((phase) => (byPhase.get(phase)?.percent ?? 100) < 100);
    level =
      (pending === undefined ? null : levelOfPhase(pending)) ||
      content.levels[content.levels.length - 1];
  }
  const levelIndex = content.levels.findIndex((candidate) => candidate.id === level.id);
  const next = content.levels[levelIndex + 1] || null;

  const nodes = built.map(({ node, items, percent }) => {
    let state = "todo";
    if (percent === 100) state = "done";
    else if (node.kind !== "java" && node.phase === currentPhase) state = "current";
    return {
      id: node.id,
      kind: node.kind,
      phase: node.phase,
      level: node.phase === null ? null : levelOfPhase(node.phase)?.id || null,
      title: node.title,
      shortTitle: node.shortTitle,
      who: node.who,
      becomes: node.becomes,
      percent,
      state,
      items,
    };
  });

  const javaNodes = built.filter((entry) => entry.node.kind === "java");
  const currentEntry = byPhase.get(currentPhase);
  const unitsDone = units.filter((unit) => unit.status === "completed").length;

  return {
    sheet: {
      className: "Backend Dev",
      level: { id: level.id, name: level.name },
      nextLevel: next
        ? { id: next.id, name: next.name, firstPhase: Math.min(...next.phases) }
        : null,
      xpPercent,
      phasesDone,
      phasesTotal: 27,
      unitsDone,
      unitsTotal: units.length,
      currentPhase,
      currentUnitId: currentUnit?.id ?? currentUnitId,
      remainingInPhase: currentEntry
        ? currentEntry.items.filter((item) => !item.done).length
        : 0,
      java: { percent: Math.round(average(javaNodes.map((entry) => entry.percent))) },
      dsa: { percent: byPhase.get(12)?.percent ?? 0 },
    },
    levels: content.levels,
    nodes,
  };
}
