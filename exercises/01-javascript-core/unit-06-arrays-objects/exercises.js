// Unidade 6 — Arrays e objetos
//
// Implemente cada função. Não use bibliotecas externas.
// Veja README.md para o enunciado completo de cada exercício.

// --- Fundamentais ---------------------------------------------------------

// test: node --test --test-name-pattern="buildRangeArray" exercises/01-javascript-core/unit-06-arrays-objects/exercises.test.js
export function buildRangeArray(start, end) {
  const array = [];
  for (let i = start; i <= end; i++) {
    array.push(i);
  }
  return array;
}

// test: node --test --test-name-pattern="pushAndSlice" exercises/01-javascript-core/unit-06-arrays-objects/exercises.test.js
export function pushAndSlice(items, newItem, maxLength) {
  const result = [];
  for (let i = 0; i < items.length; i++) {
    result.push(items[i]);
  }

  result.push(newItem);

  if (result.length > maxLength) {
    result.shift();
  }
  return result;
}

// test: node --test --test-name-pattern="joinNames" exercises/01-javascript-core/unit-06-arrays-objects/exercises.test.js
export function joinNames(people) {
  if (people.length < 0) {
    return "";
  }
  let result = "";
  for (let i = 0; i < people.length; i++) {
    result += people[i].name;
    if (people.length !== i + 1) {
      result += ", ";
    }
  }
  return result;
}

// test: node --test --test-name-pattern="findProductById" exercises/01-javascript-core/unit-06-arrays-objects/exercises.test.js
export function findProductById(products, id) {
  let result = undefined;
  for (let i = 0; i < products.length; i++) {
    if (products[i].id == id) {
      result = products[i];
    }
  }

  return result;
}

// test: node --test --test-name-pattern="countByKey" exercises/01-javascript-core/unit-06-arrays-objects/exercises.test.js
export function countByKey(items, key) {
  const result = {};

  for (const item of items) {
    const value = item[key];
    if (result[value] !== undefined) {
      result[value]++;
    } else {
      result[value] = 1;
    }
  }
  return result;
}

// test: node --test --test-name-pattern="buildUserObject" exercises/01-javascript-core/unit-06-arrays-objects/exercises.test.js
export function buildUserObject(id, name, email) {
  return { id, name, email };
}

// test: node --test --test-name-pattern="listObjectKeysSorted" exercises/01-javascript-core/unit-06-arrays-objects/exercises.test.js
export function listObjectKeysSorted(obj) {
  let result = Object.keys(obj);
  result.sort((a, b) => a.localeCompare(b));
  return result;
}

// test: node --test --test-name-pattern="mergeObjectsShallow" exercises/01-javascript-core/unit-06-arrays-objects/exercises.test.js
export function mergeObjectsShallow(base, overrides) {}

// --- Intermediários --------------------------------------------------------

// test: node --test --test-name-pattern="groupByStatus" exercises/01-javascript-core/unit-06-arrays-objects/exercises.test.js
export function groupByStatus(orders) {
  throw new Error("not implemented: groupByStatus");
}

// test: node --test --test-name-pattern="invertObject" exercises/01-javascript-core/unit-06-arrays-objects/exercises.test.js
export function invertObject(obj) {
  throw new Error("not implemented: invertObject");
}

// test: node --test --test-name-pattern="removeDuplicatesByKey" exercises/01-javascript-core/unit-06-arrays-objects/exercises.test.js
export function removeDuplicatesByKey(items, key) {
  throw new Error("not implemented: removeDuplicatesByKey");
}

// test: node --test --test-name-pattern="buildFrequencyTable" exercises/01-javascript-core/unit-06-arrays-objects/exercises.test.js
export function buildFrequencyTable(words) {
  throw new Error("not implemented: buildFrequencyTable");
}

// --- Debugging --------------------------------------------------------------
//
// As duas funções abaixo JÁ ESTÃO IMPLEMENTADAS, mas contêm um bug real.
// Sua tarefa não é reescrever do zero: é diagnosticar e corrigir.

// test: node --test --test-name-pattern="sumPricesBuggy" exercises/01-javascript-core/unit-06-arrays-objects/exercises.test.js
export function sumPricesBuggy(products) {
  // Sintoma relatado: o total somado vem consistentemente maior do que a
  // soma real dos preços dos produtos.
  let total = 0;
  for (let i = 0; i < products.length; i++) {
    total += products[i].price;
  }
  return total;
}

// test: node --test --test-name-pattern="addTagBuggy" exercises/01-javascript-core/unit-06-arrays-objects/exercises.test.js
export function addTagBuggy(article, tag) {
  // Sintoma relatado: depois de "adicionar uma tag" a um artigo, os
  // artigos antigos (criados antes dessa chamada) também aparecem com a
  // nova tag, mesmo sem nunca terem sido tocados diretamente.
  return {
    ...article,
    tags: article.tags.concat(tag),
  };
}

// --- Refatoração -------------------------------------------------------------
//
// Esta função já funciona corretamente. A tarefa é refatorar para usar
// métodos de array mais expressivos no lugar de laços manuais e reduzir
// mutação desnecessária, mantendo o mesmo comportamento observável.

// test: node --test --test-name-pattern="refactorActiveUserNames" exercises/01-javascript-core/unit-06-arrays-objects/exercises.test.js
export function refactorActiveUserNames(users) {
  let names = users.filter((user) => user.active).map((user) => user.name);
  return names;
}

// --- Desafio integrador -------------------------------------------------------

// test: node --test --test-name-pattern="buildInventoryReport" exercises/01-javascript-core/unit-06-arrays-objects/exercises.test.js
export function buildInventoryReport(products) {
  throw new Error("not implemented: buildInventoryReport");
}
