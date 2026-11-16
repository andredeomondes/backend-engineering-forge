package forge.java;

import static forge.java.Unit01Exercises.*;
import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;

// Cada método de teste começa com o id do exercício: `isEven_*` roda só isEven.
class Unit01ExercisesTest {

    @Test
    void isEven_paresImparesENegativos() {
        assertTrue(isEven(4));
        assertTrue(isEven(0));
        assertTrue(isEven(-6));
        assertFalse(isEven(7));
        assertFalse(isEven(-3));
    }

    @Test
    void maxOfThree_qualquerPosicao() {
        assertEquals(9, maxOfThree(9, 2, 5));
        assertEquals(9, maxOfThree(2, 9, 5));
        assertEquals(9, maxOfThree(2, 5, 9));
        assertEquals(-1, maxOfThree(-3, -1, -2));
        assertEquals(4, maxOfThree(4, 4, 4));
    }

    @Test
    void sumUpTo_somaDeUmAteN() {
        assertEquals(15, sumUpTo(5));
        assertEquals(1, sumUpTo(1));
        assertEquals(0, sumUpTo(0));
        assertEquals(0, sumUpTo(-3));
    }

    @Test
    void countVowels_maiusculasMinusculasENull() {
        assertEquals(4, countVowels("Pagamento"));
        assertEquals(5, countVowels("AEIOU"));
        assertEquals(0, countVowels("xyz"));
        assertEquals(0, countVowels(""));
        assertEquals(0, countVowels(null));
    }

    @Test
    void reverse_inverteTexto() {
        assertEquals("xip", reverse("pix"));
        assertEquals("", reverse(""));
        assertEquals("a", reverse("a"));
    }

    @Test
    void classifyAge_faixasELimites() {
        assertEquals("menor", classifyAge(0));
        assertEquals("menor", classifyAge(17));
        assertEquals("adulto", classifyAge(18));
        assertEquals("adulto", classifyAge(59));
        assertEquals("idoso", classifyAge(60));
        assertThrows(IllegalArgumentException.class, () -> classifyAge(-1));
    }

    @Test
    void average_semPerderDecimais() {
        assertEquals(2.5, average(new int[] {2, 3}), 1e-9);
        assertEquals(4.0, average(new int[] {4}), 1e-9);
        assertEquals(0.0, average(new int[] {}), 1e-9);
    }

    @Test
    void formatCents_reaisECentavos() {
        assertEquals("R$ 12,34", formatCents(1234));
        assertEquals("R$ 0,05", formatCents(5));
        assertEquals("R$ 100,00", formatCents(10000));
        assertEquals("-R$ 2,50", formatCents(-250));
        assertEquals("R$ 0,00", formatCents(0));
    }

    @Test
    void fixPercentageBug_devolvePorcentagemComDecimais() {
        assertEquals(12.5, fixPercentageBug(25, 200), 1e-9);
        assertEquals(50.0, fixPercentageBug(1, 2), 1e-9);
        assertEquals(100.0, fixPercentageBug(3, 3), 1e-9);
    }

    @Test
    void fixStringEqualityBug_comparaConteudo() {
        String fromDatabase = new String("PAID");
        assertTrue(fixStringEqualityBug(fromDatabase, "PAID"));
        assertFalse(fixStringEqualityBug("PENDING", "PAID"));
        assertFalse(fixStringEqualityBug(null, "PAID"));
    }
}
