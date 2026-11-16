package forge.java;

// Unidade 1 — Tipos, controle de fluxo e métodos em Java
//
// Implemente cada método. Não use bibliotecas externas.
// Enunciados: exercises/13-java-core/units/unit-01-tipos-controle-metodos/README.md
// Testes:     mvn -q -f exercises/13-java-core/pom.xml test -Dtest=Unit01ExercisesTest
public final class Unit01Exercises {

    private Unit01Exercises() {}

    // --- Fundamentais -------------------------------------------------------

    public static boolean isEven(int n) {
        throw new UnsupportedOperationException("TODO: isEven");
    }

    public static int maxOfThree(int a, int b, int c) {
        throw new UnsupportedOperationException("TODO: maxOfThree");
    }

    public static int sumUpTo(int n) {
        throw new UnsupportedOperationException("TODO: sumUpTo");
    }

    public static int countVowels(String text) {
        throw new UnsupportedOperationException("TODO: countVowels");
    }

    public static String reverse(String text) {
        throw new UnsupportedOperationException("TODO: reverse");
    }

    public static String classifyAge(int age) {
        throw new UnsupportedOperationException("TODO: classifyAge");
    }

    // --- Intermediários -----------------------------------------------------

    public static double average(int[] values) {
        throw new UnsupportedOperationException("TODO: average");
    }

    public static String formatCents(long cents) {
        throw new UnsupportedOperationException("TODO: formatCents");
    }

    // --- Debugging (o código abaixo tem bug proposital) ---------------------

    public static double fixPercentageBug(int part, int whole) {
        return part / whole * 100;
    }

    public static boolean fixStringEqualityBug(String status, String expected) {
        return status == expected;
    }
}
