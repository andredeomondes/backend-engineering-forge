package forge.java;

import static org.junit.jupiter.api.Assertions.*;

import forge.java.Unit02Exercises.Account;
import forge.java.Unit02Exercises.CustomerId;
import forge.java.Unit02Exercises.FlatFee;
import forge.java.Unit02Exercises.Money;
import forge.java.Unit02Exercises.PercentFee;
import forge.java.Unit02Exercises.TransactionType;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

// Cada método de teste começa com o id do exercício: `plus_*` roda só plus.
class Unit02ExercisesTest {

    private static Account accountWith(long cents) {
        Account account = new Account("acc-1");
        if (cents > 0) account.deposit(new Money(cents));
        return account;
    }

    @Test
    void plus_devolveNovoValorSemMudarOriginal() {
        Money a = new Money(1_000);
        Money result = a.plus(new Money(250));
        assertEquals(new Money(1_250), result);
        assertEquals(new Money(1_000), a);
    }

    @Test
    void minus_podeFicarNegativo() {
        assertEquals(new Money(750), new Money(1_000).minus(new Money(250)));
        assertEquals(new Money(-50), new Money(100).minus(new Money(150)));
    }

    @Test
    void isNegative_somenteAbaixoDeZero() {
        assertTrue(new Money(-1).isNegative());
        assertFalse(new Money(0).isNegative());
        assertFalse(new Money(10).isNegative());
    }

    @Test
    void isDebit_saqueETransferencia() {
        assertFalse(TransactionType.DEPOSIT.isDebit());
        assertTrue(TransactionType.WITHDRAWAL.isDebit());
        assertTrue(TransactionType.TRANSFER.isDebit());
    }

    @Test
    void deposit_somaEValida() {
        Account account = new Account("acc-1");
        account.deposit(new Money(500));
        account.deposit(new Money(250));
        assertEquals(new Money(750), account.balance());
        assertThrows(IllegalArgumentException.class, () -> account.deposit(new Money(0)));
        assertThrows(IllegalArgumentException.class, () -> account.deposit(new Money(-10)));
        assertEquals(new Money(750), account.balance());
    }

    @Test
    void withdraw_subtraiEValida() {
        Account account = accountWith(1_000);
        account.withdraw(new Money(400));
        assertEquals(new Money(600), account.balance());
        assertThrows(IllegalArgumentException.class, () -> account.withdraw(new Money(0)));
    }

    @Test
    void withdraw_saldoInsuficienteNaoAlteraSaldo() {
        Account account = accountWith(100);
        assertThrows(IllegalStateException.class, () -> account.withdraw(new Money(101)));
        assertEquals(new Money(100), account.balance());
    }

    @Test
    void FlatFee_valorFixo() {
        FlatFee fee = new FlatFee(new Money(200));
        assertEquals(new Money(200), fee.apply(new Money(10)));
        assertEquals(new Money(200), fee.apply(new Money(1_000_000)));
    }

    @Test
    void PercentFee_pontosBaseArredondandoParaBaixo() {
        assertEquals(new Money(150), new PercentFee(150).apply(new Money(10_000)));
        assertEquals(new Money(1), new PercentFee(150).apply(new Money(99)));
        assertEquals(new Money(0), new PercentFee(150).apply(new Money(50)));
    }

    @Test
    void CustomerId_igualdadePorValor() {
        CustomerId a = new CustomerId("cus-42");
        CustomerId b = new CustomerId("cus-42");
        assertEquals(a, b);
        Set<CustomerId> ids = new HashSet<>();
        ids.add(a);
        ids.add(b);
        assertEquals(1, ids.size());
        assertNotEquals(a, new CustomerId("cus-43"));
    }

    @Test
    void transfer_debitaComTarifaECreditaValor() {
        Account from = accountWith(10_000);
        Account to = accountWith(0);
        Unit02Exercises.transfer(from, to, new Money(5_000), new FlatFee(new Money(100)));
        assertEquals(new Money(4_900), from.balance());
        assertEquals(new Money(5_000), to.balance());
    }

    @Test
    void transfer_semSaldoNaoMudaNenhumaConta() {
        Account from = accountWith(5_000);
        Account to = accountWith(300);
        assertThrows(
                IllegalStateException.class,
                () -> Unit02Exercises.transfer(
                        from, to, new Money(5_000), new FlatFee(new Money(1))));
        assertEquals(new Money(5_000), from.balance());
        assertEquals(new Money(300), to.balance());
    }
}
