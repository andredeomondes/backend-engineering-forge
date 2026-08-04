# Dicas — Unidade 6 (TypeScript)

Use `DICA_1`, `DICA_2` ou `DICA_3` dizendo qual exercício travou. Abaixo
está o roteiro geral que a mentoria segue nesta unidade.

## Nível 1 — direção, sem código

- Para `BankAccount.withdraw`: pense nas duas condições que precisam
  lançar `RangeError` — uma sobre o valor pedido (`amount`), outra sobre a
  relação entre `amount` e o saldo atual. Elas são independentes.
- Para `Employee.describe`: o método é concreto na classe abstrata, mas
  chama `this.calculateSalary()`, que é abstrato. Quem decide qual
  implementação roda quando `describe()` é chamado num `Manager`?
- Para `Developer.calculateSalary`: você tem três casos possíveis de
  `seniorityLevel`. Que estrutura mapeia uma string para um número sem
  precisar de `if/else` encadeado?
- Para `OrderProcessor.process`: o `Logger` não é herdado, é recebido no
  construtor. O que isso muda sobre como `OrderProcessor` pode ser
  testado (comparado a se ele estendesse uma classe `ConsoleLogger`)?
- Para `Wallet`: rode o construtor mentalmente com `initialBalance = 100`.
  O parâmetro chega, mas ele é usado em algum lugar?
- Para `ClearanceItem.getDiscountRate`: se `discountPercent` é `20`
  (representando 20%), e `finalPrice` faz `price - price * getDiscountRate()`,
  que valor `getDiscountRate()` precisa retornar para o desconto ser de
  20%, não de 2000%?

## Nível 2 — pista mais direta

- `BankAccount.withdraw`: `if (amount <= 0) throw new RangeError(...)`
  primeiro; depois `if (amount > this.balance) throw new RangeError(...)`.
- `Employee.describe`: basta
  `` `${this.name}: R$ ${this.calculateSalary().toFixed(2)}` `` — não
  precisa saber qual subclasse é, o polimorfismo resolve isso em tempo de
  execução.
- `Developer.calculateSalary`: um objeto/`Record<SeniorityLevel, number>`
  com os três multiplicadores, indexado por `this.seniorityLevel`, depois
  `this.baseSalary * multiplicador`.
- `OrderProcessor.process`: com composição, qualquer objeto que satisfaça
  `Logger` funciona — um logger falso de teste, um logger real de
  produção — sem precisar herdar de nada nem sobrescrever métodos.
- `Wallet`: o construtor precisa terminar com `this.balance = initialBalance;`
  em vez de um valor fixo.
- `ClearanceItem.getDiscountRate`: `discountPercent` está em escala 0–100,
  mas `getDiscountRate()` precisa devolver uma fração 0–1. Falta dividir
  por 100.

## Nível 3 — quase o código, mas ainda não a solução

- `Developer.calculateSalary`:
  ```ts
  const multipliers: Record<SeniorityLevel, number> = {
    junior: 1.0,
    pleno: 1.3,
    senior: 1.6,
  };
  return this.baseSalary * multipliers[this.seniorityLevel];
  ```
- `describeWorkforce`: percorra com `for...of`, some
  `employee.calculateSalary()` em `totalPayroll`, e mantenha
  `highestPaidName`/`highestPaidSalary` atualizados quando
  `employee.calculateSalary() > highestPaidSalary`; lance `RangeError`
  antes do laço se `employees.length === 0`.
- `RobotDog` (refatoração): em vez de `class RobotDog extends SoundMaker`,
  declare um campo `private readonly soundMaker: SoundMaker;` e receba a
  instância no construtor (com um valor padrão `new SoundMaker()` para não
  quebrar `new RobotDog()` sem argumentos), depois chame
  `this.soundMaker.makeSound()` dentro de `bark()`. O resultado de
  `new RobotDog().bark()` precisa continuar `"Robot dog says: bip-bip"`.
  Lembrete: Node roda TypeScript em modo strip-only, então não use a
  sintaxe de parameter properties (`constructor(private x: T)`) — declare
  o campo separadamente e atribua no corpo do construtor.

Peça `MOSTRAR_SOLUCAO` apenas depois de registrar sua tentativa.
