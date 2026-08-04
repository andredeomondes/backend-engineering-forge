import { test } from "node:test";
import assert from "node:assert/strict";

import { computeStreak, totalMinutes, daysLogged, addEntry, setFocus } from "./state.js";

test("computeStreak: sem entradas", () => {
  assert.equal(computeStreak([], "2026-07-16"), 0);
});

test("computeStreak: dias consecutivos até hoje", () => {
  const entries = [
    { date: "2026-07-14", minutes: 60 },
    { date: "2026-07-15", minutes: 60 },
    { date: "2026-07-16", minutes: 60 },
  ];
  assert.equal(computeStreak(entries, "2026-07-16"), 3);
});

test("computeStreak: hoje ainda sem entrada não quebra o streak de ontem", () => {
  const entries = [
    { date: "2026-07-14", minutes: 60 },
    { date: "2026-07-15", minutes: 60 },
  ];
  assert.equal(computeStreak(entries, "2026-07-16"), 2);
});

test("computeStreak: buraco de mais de um dia zera o streak", () => {
  const entries = [
    { date: "2026-07-10", minutes: 60 },
    { date: "2026-07-11", minutes: 60 },
  ];
  assert.equal(computeStreak(entries, "2026-07-16"), 0);
});

test("computeStreak: quebra ao encontrar um buraco no meio", () => {
  const entries = [
    { date: "2026-07-10", minutes: 60 },
    { date: "2026-07-15", minutes: 60 },
    { date: "2026-07-16", minutes: 60 },
  ];
  assert.equal(computeStreak(entries, "2026-07-16"), 2);
});

test("totalMinutes: soma minutos de todas as entradas", () => {
  const entries = [{ minutes: 60 }, { minutes: 45 }, { minutes: 30 }];
  assert.equal(totalMinutes(entries), 135);
});

test("daysLogged: conta dias únicos, ignora duplicata no mesmo dia", () => {
  const entries = [
    { date: "2026-07-16" },
    { date: "2026-07-16" },
    { date: "2026-07-15" },
  ];
  assert.equal(daysLogged(entries), 2);
});

test("addEntry: retorna novo estado sem mutar o original", () => {
  const state = { currentFocus: null, entries: [] };
  const next = addEntry(state, { date: "2026-07-16", minutes: 60, summary: "ok" });
  assert.equal(state.entries.length, 0);
  assert.equal(next.entries.length, 1);
});

test("setFocus: atualiza currentFocus sem mutar o original", () => {
  const state = { currentFocus: null, entries: [] };
  const next = setFocus(state, "Fase 1 / Unidade 2");
  assert.equal(state.currentFocus, null);
  assert.equal(next.currentFocus, "Fase 1 / Unidade 2");
});
