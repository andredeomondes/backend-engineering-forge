// Pure trail computation: content + unit summaries + topic checks -> TrailData.
// Fases e unidades vêm de trilha.json (`units: true`); nada de número fixo aqui.
const JAVA_PHASE = 2;

function percentOf(done, total) {
  return total === 0 ? 0 : Math.round((100 * done) / total);
}

function average(values) {
  return values.length
    ? values.reduce((sum, value) => sum + value, 0) / values.length
    : 0;
}

export function buildNodeItems(node, units, checked) {
  const optional = new Set(node.optionalUnits || []);
  const unitItems = node.units
    ? units
        .filter((unit) => unit.phase === node.phase)
        .sort((a, b) => a.number - b.number)
        .map((unit) => ({
          id: unit.id,
          label: unit.title,
          kind: "unit",
          done: unit.status === "completed",
          unitId: unit.id,
          optional: optional.has(unit.id),
        }))
    : [];
  const topicItems = node.items.map((item) => ({
    id: item.id,
    label: item.label,
    kind: "topic",
    done: checked.has(item.id),
    optional: false,
  }));
  return [...unitItems, ...topicItems];
}

// Itens opcionais aparecem na trilha, mas não contam para o percentual da fase.
function nodePercent(items) {
  const required = items.filter((item) => !item.optional);
  return percentOf(required.filter((item) => item.done).length, required.length);
}

export function computeTrail({ content, units, checkedItemIds, currentUnitId }) {
  const checked = new Set(checkedItemIds);
  const currentUnit = units.find((unit) => unit.id === currentUnitId) || units[0];
  const currentPhase = currentUnit?.phase ?? 0;

  const built = content.nodes.map((node) => {
    const items = buildNodeItems(node, units, checked);
    return { node, items, percent: nodePercent(items) };
  });
  const byPhase = new Map(built.map((entry) => [entry.node.phase, entry]));

  // XP conta as fases principais; DSA (paralela) fica de fora.
  const xpPhaseNumbers = built
    .filter((entry) => entry.node.kind === "phase")
    .map((entry) => entry.node.phase)
    .sort((a, b) => a - b);
  const xpPhases = xpPhaseNumbers.map((phase) => byPhase.get(phase));
  const xpPercent = Math.round(average(xpPhases.map((entry) => entry.percent)));
  const phasesDone = xpPhases.filter((entry) => entry.percent === 100).length;

  const levelOfPhase = (phase) =>
    content.levels.find((level) => level.phases.includes(phase)) || null;
  let level = levelOfPhase(currentPhase);
  if (!level) {
    const pending = xpPhaseNumbers.find(
      (phase) => (byPhase.get(phase)?.percent ?? 100) < 100,
    );
    level =
      (pending === undefined ? null : levelOfPhase(pending)) ||
      content.levels[content.levels.length - 1];
  }
  const levelIndex = content.levels.findIndex((candidate) => candidate.id === level.id);
  const next = content.levels[levelIndex + 1] || null;

  const nodes = built.map(({ node, items, percent }) => {
    let state = "todo";
    if (percent === 100) state = "done";
    else if (node.phase === currentPhase) state = "current";
    return {
      id: node.id,
      kind: node.kind,
      phase: node.phase,
      level: levelOfPhase(node.phase)?.id || null,
      title: node.title,
      shortTitle: node.shortTitle,
      who: node.who,
      becomes: node.becomes,
      percent,
      state,
      items,
    };
  });

  const currentEntry = byPhase.get(currentPhase);
  const unitsDone = units.filter((unit) => unit.status === "completed").length;

  return {
    sheet: {
      className: "Backend Dev",
      level: { id: level.id, name: level.name },
      nextLevel: next
        ? { id: next.id, name: next.name, firstPhase: next.phases[0] }
        : null,
      xpPercent,
      phasesDone,
      phasesTotal: xpPhases.length,
      unitsDone,
      unitsTotal: units.length,
      currentPhase,
      currentUnitId: currentUnit?.id ?? currentUnitId,
      remainingInPhase: currentEntry
        ? currentEntry.items.filter((item) => !item.done).length
        : 0,
      java: { percent: byPhase.get(JAVA_PHASE)?.percent ?? 0 },
      dsa: {
        percent: built.find((entry) => entry.node.kind === "dsa")?.percent ?? 0,
      },
    },
    levels: content.levels,
    nodes,
  };
}
