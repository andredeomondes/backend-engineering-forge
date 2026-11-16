package forge.java;

// Unidade 2 — Classes, records, enums e interfaces (domínio LedgerFlow)
//
// Os tipos já existem. Implemente os métodos marcados com TODO.
// Enunciados: exercises/13-java-core/units/unit-02-classes-records-interfaces/README.md
// Testes:     mvn -q -f exercises/13-java-core/pom.xml test -Dtest=Unit02ExercisesTest
public final class Unit02Exercises {

    private Unit02Exercises() {}

    // --- Fundamentais -------------------------------------------------------

    /** Dinheiro em centavos. Imutável: operações devolvem um novo Money. */
    public record Money(long cents) {

        public Money plus(Money other) {
            throw new UnsupportedOperationException("TODO: plus");
        }

        public Money minus(Money other) {
            throw new UnsupportedOperationException("TODO: minus");
        }

        public boolean isNegative() {
            throw new UnsupportedOperationException("TODO: isNegative");
        }
    }

    public enum TransactionType {
        DEPOSIT,
        WITHDRAWAL,
        TRANSFER;

        public boolean isDebit() {
            throw new UnsupportedOperationException("TODO: isDebit");
        }
    }

    public static final class Account {
        private final String id;
        private Money balance = new Money(0);

        public Account(String id) {
            this.id = id;
        }

        public String id() {
            return id;
        }

        public Money balance() {
            return balance;
        }

        public void deposit(Money amount) {
            throw new UnsupportedOperationException("TODO: deposit");
        }

        public void withdraw(Money amount) {
            throw new UnsupportedOperationException("TODO: withdraw");
        }
    }

    // --- Intermediários -----------------------------------------------------

    /** Calcula a tarifa cobrada sobre uma operação. */
    public interface Fee {
        Money apply(Money amount);
    }

    public record FlatFee(Money value) implements Fee {
        @Override
        public Money apply(Money amount) {
            throw new UnsupportedOperationException("TODO: FlatFee");
        }
    }

    /** Tarifa em pontos-base: 150 = 1,5%. */
    public record PercentFee(long basisPoints) implements Fee {
        @Override
        public Money apply(Money amount) {
            throw new UnsupportedOperationException("TODO: PercentFee");
        }
    }

    // --- Debugging (o código abaixo tem bug proposital) ---------------------

    public static final class CustomerId {
        private final String value;

        public CustomerId(String value) {
            this.value = value;
        }

        public String value() {
            return value;
        }
    }

    // --- Desafio ------------------------------------------------------------

    public static void transfer(Account from, Account to, Money amount, Fee fee) {
        throw new UnsupportedOperationException("TODO: transfer");
    }
}
