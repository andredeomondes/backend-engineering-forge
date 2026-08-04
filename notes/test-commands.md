# Comandos de teste rápido

Roda só um exercício de cada vez, sem esperar a suite inteira.

## Sintaxe geral

```bash
npm test -- --test-name-pattern="<nome-da-funcao>"
```

## Unidade 1 — valores, tipos e operadores

```bash
npm test -- --test-name-pattern="classifyValue"
npm test -- --test-name-pattern="isTruthyManually"
npm test -- --test-name-pattern="compareLooseAndStrict"
npm test -- --test-name-pattern="coerceToNumberManually"
npm test -- --test-name-pattern="sumOnlyNumbers"
npm test -- --test-name-pattern="concatenateAsStrings"
npm test -- --test-name-pattern="clampNumber"
npm test -- --test-name-pattern="isSameValueZero"
npm test -- --test-name-pattern="parsePercentageString"
npm test -- --test-name-pattern="normalizeBooleanish"
npm test -- --test-name-pattern="safeDivide"
npm test -- --test-name-pattern="deepTypeOf"
npm test -- --test-name-pattern="fixEqualityBug"
npm test -- --test-name-pattern="fixCoercionBug"
npm test -- --test-name-pattern="refactorDiscountTier"
npm test -- --test-name-pattern="normalizeOrderInput"
```

## Suite inteira

```bash
npm test
```
