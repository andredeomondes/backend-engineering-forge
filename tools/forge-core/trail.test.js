import assert from "node:assert/strict";
import test from "node:test";

import { useTempDatabase } from "./test-helpers.js";

useTempDatabase();
const services = await import("./services.js");

test("XP pesa fases igualmente e ignora a Fase 12", () => {
  services.markTrailNode("f00");
  const t = services.getTrail();
  assert.equal(t.sheet.phasesTotal, 27);
  assert.equal(t.sheet.xpPercent, Math.round(100 / 27));
  assert.equal(t.sheet.phasesDone, 1);
});

test("tópico marcado persiste e desmarca", () => {
  const id = services.getTrail().nodes.find((n) => n.id === "f05").items[0].id;
  assert.equal(
    services.setTrailItem(id, true).nodes.find((n) => n.id === "f05").items[0].done,
    true,
  );
  assert.equal(
    services.setTrailItem(id, false).nodes.find((n) => n.id === "f05").items[0].done,
    false,
  );
});

test("fase 1 lista unidades e nível LV1", () => {
  services.setCurrentUnit("js-09");
  const t = services.getTrail();
  assert.equal(t.nodes.find((n) => n.id === "f01").items[0].kind, "unit");
  assert.equal(t.sheet.level.id, "lv1");
  assert.equal(t.sheet.nextLevel.firstPhase, 26);
  assert.equal(t.nodes.find((n) => n.id === "f01").state, "current");
});

test("fase atual 12 usa nível da primeira fase pendente", () => {
  services.setCurrentUnit("dsa-01");
  assert.equal(services.getTrail().sheet.level.id, "lv1");
});

test("status das fases no Progresso segue a Trilha (tópicos contam)", () => {
  services.setCurrentUnit("js-09");
  const f05 = services.getTrail().nodes.find((n) => n.id === "f05");
  for (const item of f05.items) services.setTrailItem(item.id, true);
  const phases = services.getDashboard().phases;
  assert.equal(phases.find((p) => p.number === 5).status, "completed");
  assert.equal(phases.find((p) => p.number === 1).status, "active");
  assert.equal(phases.find((p) => p.number === 6).status, "available");
});

test("item desconhecido é recusado", () => {
  assert.throws(() => services.setTrailItem("nao-existe", true));
  assert.throws(() => services.markTrailNode("nao-existe"));
});

test("marcar nó de unidades conclui as unidades da fase", () => {
  services.markTrailNode("f12");
  const node = services.getTrail().nodes.find((n) => n.id === "f12");
  assert.equal(node.percent, 100);
  assert.equal(node.state, "done");
});

test("setTrailItem recusa id de unidade e done não booleano", () => {
  assert.throws(() => services.setTrailItem("js-01", true));
  const id = services.getTrail().nodes.find((n) => n.id === "f06").items[0].id;
  assert.throws(() => services.setTrailItem(id, "yes"));
});

test("unidades opcionais aparecem, mas não contam no percentual da fase", () => {
  const f01 = services.getTrail().nodes.find((n) => n.id === "f01");
  const js10 = f01.items.find((item) => item.id === "js-10");
  assert.equal(js10.optional, true);
  assert.equal(f01.items.find((item) => item.id === "js-09").optional, false);
  for (const item of f01.items.filter((i) => !i.optional))
    services.markAllMissions(item.unitId);
  assert.equal(services.getTrail().nodes.find((n) => n.id === "f01").percent, 100);
});

test("Fase 2 lista as unidades Java e alimenta o slot Java da ficha", () => {
  const t = services.getTrail();
  const f02 = t.nodes.find((n) => n.id === "f02");
  assert.deepEqual(
    f02.items.filter((i) => i.kind === "unit").map((i) => i.id),
    ["java-01", "java-02", "java-03"],
  );
  assert.ok(f02.items.some((i) => i.kind === "topic"));
  assert.equal(t.sheet.java.percent, f02.percent);
});
