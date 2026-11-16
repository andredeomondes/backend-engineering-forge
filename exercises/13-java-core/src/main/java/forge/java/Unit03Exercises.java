package forge.java;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

// Unidade 3 — Coleções e Streams (a Unidade 9 de JS, agora em Java)
//
// Use Streams em vez de laços for. Implemente os métodos marcados com TODO.
// Enunciados: exercises/13-java-core/units/unit-03-colecoes-streams/README.md
// Testes:     mvn -q -f exercises/13-java-core/pom.xml test -Dtest=Unit03ExercisesTest
public final class Unit03Exercises {

    private Unit03Exercises() {}

    /** Transação do extrato do LedgerFlow. status: "PAID", "PENDING" ou "FAILED". */
    public record Transaction(String id, String category, long amountCents, String status) {}

    // --- Fundamentais -------------------------------------------------------

    public static List<Integer> doubleAll(List<Integer> numbers) {
        throw new UnsupportedOperationException("TODO: doubleAll");
    }

    public static List<Integer> keepEven(List<Integer> numbers) {
        throw new UnsupportedOperationException("TODO: keepEven");
    }

    public static int sumAll(List<Integer> numbers) {
        throw new UnsupportedOperationException("TODO: sumAll");
    }

    public static Optional<Integer> findFirstAbove(List<Integer> numbers, int threshold) {
        throw new UnsupportedOperationException("TODO: findFirstAbove");
    }

    public static boolean anyNegative(List<Integer> numbers) {
        throw new UnsupportedOperationException("TODO: anyNegative");
    }

    public static List<Integer> distinctSorted(List<Integer> numbers) {
        throw new UnsupportedOperationException("TODO: distinctSorted");
    }

    // --- Intermediários -----------------------------------------------------

    public static long totalPaidCents(List<Transaction> transactions) {
        throw new UnsupportedOperationException("TODO: totalPaidCents");
    }

    public static Map<String, Long> sumByCategory(List<Transaction> transactions) {
        throw new UnsupportedOperationException("TODO: sumByCategory");
    }

    // --- Debugging (o código abaixo tem bug proposital) ---------------------

    public static List<Integer> sortedCopy(List<Integer> numbers) {
        Collections.sort(numbers);
        return numbers;
    }

    // --- Desafio ------------------------------------------------------------

    public static List<String> topCategories(List<Transaction> transactions, int n) {
        throw new UnsupportedOperationException("TODO: topCategories");
    }
}
