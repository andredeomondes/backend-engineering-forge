# LinkedIn — JavaScript: tipos e coerção

## Formato recomendado

Carrossel de 7 páginas + legenda sobre valores, tipos, coerção e igualdade em
JavaScript.

Tom: aprendizado em público, prático e honesto. É uma postagem avulsa de
Andre Deomondes, não uma marca ou série do Forge.

---

## Texto do carrossel

### Slide 1 — capa

**Por que `"5" + 3` e `"5" - 3` dão resultados diferentes?**

A primeira unidade do meu Backend Engineering Forge começa por aqui.

*JavaScript · tipos e coerção*

### Slide 2

**O JavaScript tenta ajudar — e é aí que mora o risco.**

```js
"5" + 3 // "53"
"5" - 3 // 2
```

No primeiro caso, o `+` concatena. No segundo, o `-` força a conversão para
número.

O mesmo dado pode se comportar de formas diferentes dependendo do operador.

### Slide 3

**No backend, dados raramente chegam “perfeitos”.**

Um corpo de requisição pode trazer:

```js
{ price: "29.90", quantity: "2" }
```

Antes de calcular ou persistir, a API precisa saber: isso é texto, número
válido ou uma entrada inválida?

### Slide 4

**Tipo não é só detalhe da linguagem. É contrato.**

```js
const total = price * quantity;
```

Esse cálculo só é confiável depois de validar e normalizar os valores de
entrada.

Sem isso, uma regra de negócio pode aceitar dados ambíguos ou devolver um
resultado inesperado.

### Slide 5

**Outro atalho perigoso: igualdade frouxa.**

```js
"1" == 1  // true
"1" === 1 // false
```

`==` permite coerção antes de comparar. `===` compara tipo e valor.

Para contratos de API e identificadores, deixar essa diferença explícita evita
surpresas difíceis de rastrear.

### Slide 6

**Isso não é “só JavaScript básico”.**

Ela treina a base para:

- validar entradas de uma requisição;
- distinguir valor ausente de valor inválido;
- impedir concatenação no lugar de cálculo;
- comparar IDs sem conversões escondidas;
- devolver erros claros para quem consome a API.

### Slide 7 — encerramento

**Toda API confiável começa entendendo o que recebeu.**

Valores, tipos, operadores, coerção, truthy/falsy e igualdade estrita são
fundamentos para interpretar dados de forma previsível.

O objetivo não é decorar peculiaridades do JavaScript. É construir código que
interpreta dados de forma previsível.

Qual comportamento de JavaScript mais te surpreendeu no início?

---

## Legenda pronta para publicar

Valores, tipos, operadores, coerção e igualdade em JavaScript parecem assuntos
simples — até chegar a hora de interpretar dados em uma API.

Mas ele aparece logo na porta de entrada de qualquer API. Dados chegam como
texto, números, campos vazios ou formatos inesperados. Se a aplicação não
valida e normaliza isso antes de aplicar uma regra de negócio, um cálculo pode
virar concatenação e uma comparação pode aceitar o identificador errado.

```js
"5" + 3 // "53"
"5" - 3 // 2

"1" == 1  // true
"1" === 1 // false
```

É por isso que estou tratando a base como engenharia, não como etapa para
“pular logo para o framework”. Antes de construir rotas, bancos e serviços,
quero entender exatamente como o código interpreta os dados que recebe.

Qual comportamento de JavaScript mais te surpreendeu quando começou?

#JavaScript #Backend #NodeJS #SoftwareEngineering #AprendizadoEmPublico

---

## Direção visual

- Formato: 1080 × 1350 px (4:5), com indicador `01/07` até `07/07`.
- Fundo grafite, texto branco e uma cor de destaque única (laranja ou verde).
- Slides 2 e 5 devem dar prioridade máxima aos pares de código; são o gancho
  visual e precisam de fonte monoespaçada grande.
- Assinatura discreta no rodapé: `Andre Deomondes · JavaScript · tipos e coerção`.
