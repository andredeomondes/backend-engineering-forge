import assert from "node:assert/strict";
import test from "node:test";

import { addDays, daysBetween, localDateString } from "./dates.js";

test("localDateString usa a data local, não UTC", () => {
  const lateEvening = new Date(2026, 6, 25, 23, 30);
  assert.equal(localDateString(lateEvening), "2026-07-25");
});

test("addDays atravessa meses", () => {
  assert.equal(addDays("2026-07-31", 2), "2026-08-02");
});

test("daysBetween compara datas sem horário", () => {
  assert.equal(daysBetween("2026-07-26", "2026-07-24"), 2);
});
