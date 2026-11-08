import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { useTempDatabase } from "./test-helpers.js";

useTempDatabase();
const { PROGRESS_PATH } = await import("./paths.js");
const services = await import("./services.js");

const lines = new Set(
  readFileSync(PROGRESS_PATH, "utf8")
    .split(/\r?\n/)
    .map((line) => line.trimEnd()),
);

test("seed da Fase 0 reflete PROGRESS.md e roda uma vez só", () => {
  const f00 = services.getTrail().nodes.find((n) => n.id === "f00");
  let checked = 0;
  for (const item of f00.items) {
    const expected = lines.has(`- [x] ${item.label}`);
    assert.equal(item.done, expected, item.label);
    if (expected) checked += 1;
  }
  assert.ok(checked > 0 && checked < f00.items.length);

  const target = f00.items.find((item) => item.done);
  services.setTrailItem(target.id, false);
  const again = services.getTrail().nodes.find((n) => n.id === "f00");
  assert.equal(again.items.find((item) => item.id === target.id).done, false);
});
