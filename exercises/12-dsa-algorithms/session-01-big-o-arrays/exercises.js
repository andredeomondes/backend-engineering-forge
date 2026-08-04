// DSA — Sessão 01 — Big O e arrays (Bloco 1: Fundamentos)
//
// Fase 12 roda em paralelo à Fase 1, sem competir com o ritmo do projeto.
// Decisão de 2026-07-23: esta trilha começa em JavaScript puro e migra
// para TypeScript quando a Fase 2 for liberada (ver PROGRESS.md).
//
// Implemente cada função. Veja README.md para o enunciado completo.

// --- Fundamentais -----------------------------------------------------------

export function sumArray(arr) {
  throw new Error("not implemented: sumArray");
}

export function findMax(arr) {
  throw new Error("not implemented: findMax");
}

export function countFrequency(arr) {
  throw new Error("not implemented: countFrequency");
}

export function hasDuplicate(arr) {
  throw new Error("not implemented: hasDuplicate");
}

export function reverseArrayInPlace(arr) {
  throw new Error("not implemented: reverseArrayInPlace");
}

export function factorial(n) {
  throw new Error("not implemented: factorial");
}

// --- Otimização de complexidade ----------------------------------------------
//
// A função abaixo JÁ FUNCIONA e já tem testes verdes, mas é O(n²). Sua
// tarefa não é corrigir um bug de comportamento — é reescrever para O(n)
// mantendo o mesmo resultado observável.

export function findFirstDuplicateQuadratic(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) {
        return arr[i];
      }
    }
  }
  return null;
}

// --- Desafio integrador (ligado a backend) -----------------------------------

export function topKFrequent(arr, k) {
  throw new Error("not implemented: topKFrequent");
}
