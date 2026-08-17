import assert from "node:assert/strict";
import test from "node:test";

import { findUnitDirectory, normalizeSqlUnit } from "./run-unit.js";

test("normalizeSqlUnit aceita os formatos documentados", () => {
  assert.equal(normalizeSqlUnit("sql-01"), "sql-01");
  assert.equal(normalizeSqlUnit("unit-4"), "sql-04");
  assert.equal(normalizeSqlUnit("8"), "sql-08");
});

test("normalizeSqlUnit rejeita unidade fora da Fase 4", () => {
  assert.throws(() => normalizeSqlUnit("sql-09"), /sql-01 e sql-08/);
  assert.throws(() => normalizeSqlUnit(""), /sql-01 e sql-08/);
});

test("findUnitDirectory encontra a pasta pelo ID estável", () => {
  assert.equal(
    findUnitDirectory("sql-02", ["unit-01-modelagem", "unit-02-consultas"]),
    "unit-02-consultas",
  );
});

