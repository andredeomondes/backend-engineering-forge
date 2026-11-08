import assert from "node:assert/strict";
import test from "node:test";

import { useTempDatabase } from "./test-helpers.js";

useTempDatabase();
const services = await import("./services.js");

test("XP pesa fases igualmente e ignora a Fase 12", () => {
  services.markTrailNode("f00");
  const t = services.getTrail();
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
  assert.equal(t.sheet.nextLevel.firstPhase, 4);
  assert.equal(t.nodes.find((n) => n.id === "f01").state, "current");
});

test("fase atual 12 usa nível da primeira fase pendente", () => {
  services.setCurrentUnit("dsa-01");
  assert.equal(services.getTrail().sheet.level.id, "lv1");
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
