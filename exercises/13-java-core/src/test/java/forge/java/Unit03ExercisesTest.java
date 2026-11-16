package forge.java;

import static forge.java.Unit03Exercises.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.junit.jupiter.api.Test;

// Cada método de teste começa com o id do exercício: `doubleAll_*` roda só doubleAll.
class Unit03ExercisesTest {

    private static final List<Transaction> STATEMENT = List.of(
            new Transaction("t1", "mercado", 12_000, "PAID"),
            new Transaction("t2", "transporte", 3_500, "PAID"),
            new Transaction("t3", "mercado", 8_000, "PAID"),
            new Transaction("t4", "lazer", 20_000, "PENDING"),
            new Transaction("t5", "lazer", 5_000, "PAID"),
            new Transaction("t6", "transporte", 1_500, "FAILED"),
            new Transaction("t7", "saude", 5_000, "PAID"));

    @Test
    void doubleAll_dobraCadaNumero() {
        assertEquals(List.of(2, 4, 6), doubleAll(List.of(1, 2, 3)));
        assertEquals(List.of(), doubleAll(List.of()));
    }

    @Test
    void keepEven_somentePares() {
        assertEquals(List.of(2, 4, -6), keepEven(List.of(1, 2, 3, 4, -6)));
        assertEquals(List.of(), keepEven(List.of(1, 3)));
    }

    @Test
    void sumAll_somaComVazio() {
        assertEquals(10, sumAll(List.of(1, 2, 3, 4)));
        assertEquals(0, sumAll(List.of()));
    }

    @Test
    void findFirstAbove_optional() {
        assertEquals(Optional.of(7), findFirstAbove(List.of(3, 7, 9), 5));
        assertEquals(Optional.empty(), findFirstAbove(List.of(1, 2), 5));
        assertEquals(Optional.empty(), findFirstAbove(List.of(5), 5));
    }

    @Test
    void anyNegative_anyMatch() {
        assertTrue(anyNegative(List.of(3, -1, 4)));
        assertFalse(anyNegative(List.of(0, 1)));
        assertFalse(anyNegative(List.of()));
    }

    @Test
    void distinctSorted_semRepetidosEmOrdem() {
        assertEquals(List.of(1, 2, 3), distinctSorted(List.of(3, 1, 2, 3, 1)));
        assertEquals(List.of(), distinctSorted(List.of()));
    }

    @Test
    void totalPaidCents_somenteStatusPaid() {
        assertEquals(33_500, totalPaidCents(STATEMENT));
        assertEquals(0, totalPaidCents(List.of()));
    }

    @Test
    void sumByCategory_agrupaSomentePagas() {
        assertEquals(
                Map.of("mercado", 20_000L, "transporte", 3_500L, "lazer", 5_000L, "saude", 5_000L),
                sumByCategory(STATEMENT));
    }

    @Test
    void sortedCopy_naoAlteraOriginalEAceitaImutavel() {
        List<Integer> original = new ArrayList<>(List.of(3, 1, 2));
        assertEquals(List.of(1, 2, 3), sortedCopy(original));
        assertEquals(List.of(3, 1, 2), original);
        assertEquals(List.of(1, 2, 3), sortedCopy(List.of(2, 3, 1)));
    }

    @Test
    void topCategories_maiorTotalComDesempateAlfabetico() {
        assertEquals(List.of("mercado", "lazer", "saude"), topCategories(STATEMENT, 3));
        assertEquals(List.of("mercado"), topCategories(STATEMENT, 1));
        assertEquals(List.of(), topCategories(List.of(), 2));
    }
}
