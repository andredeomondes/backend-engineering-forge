# Java base — Fase 2

Trilha principal de backend do Forge (ver `docs/adr/0002-java-spring-main-stack.md`).
Um projeto Maven único guarda o código de todas as unidades; cada unidade
tem enunciado e dicas em `units/unit-NN-<slug>/`.

```
exercises/13-java-core/
├── pom.xml                         JUnit 5, Java 21 (release)
├── units/unit-01-…/README.md       enunciado, perguntas, gate
├── units/unit-01-…/hints.md        dicas em 3 níveis
├── src/main/java/forge/java/Unit01Exercises.java      você implementa
└── src/test/java/forge/java/Unit01ExercisesTest.java  testes (não altere)
```

## Pré-requisitos

- JDK 21 ou mais novo (`java -version`)
- Maven 3.9+ (`mvn -v`)

## Rodar testes

```bash
mvn -q -f exercises/13-java-core/pom.xml test -Dtest=Unit01ExercisesTest
```

Um exercício só: `-Dtest=Unit01ExercisesTest#isEven_*`. O painel usa o mesmo
comando e lê o relatório em `target/surefire-reports/`.

## Unidades

| ID | Unidade | Ponte com JS |
|---|---|---|
| java-01 | Tipos, controle de fluxo e métodos | Unidades 1–3 |
| java-02 | Classes, records, enums e interfaces | Unidade 13 |
| java-03 | Coleções e Streams | Unidade 9 |

As próximas (exceções e I/O, generics, testes com JUnit/Mockito) são
materializadas quando a java-01 estiver ativa, seguindo a regra de no
máximo duas unidades à frente.
