import { readFileSync } from "fs";

class Monkey {
  public inspectCount = 0;

  constructor(
    public monkeyId: number,
    private itemsList: number[],
    private first: number|'old',
    private second: number|'old',
    private operator: '+'|'*',
    public divisor: number,
    private ifTrueMonkeyId: number,
    private ifFalseMonkeyId: number,
    private divideWorryLevel: boolean,
  ) {}

  static fromString(monkeyCode: string, divideWorryLevel = true) {
    const lines = [
      /Monkey (?<monkeyId>\d+):/,
      /  Starting items: (?<itemsList>[\d, ]+)/,
      /  Operation: new = (?<first>\w+) (?<operator>\+|\*) (?<second>\w+)/,
      /  Test: divisible by (?<divisor>\d+)/,
      /    If true: throw to monkey (?<ifTrueMonkeyId>\d+)/,
      /    If false: throw to monkey (?<ifFalseMonkeyId>\d+)/,
    ]

    const finalRegex = new RegExp(
      lines.map(regex => regex.source).join('\n'),
    )

    const {monkeyId, itemsList, first, operator, second, divisor, ifTrueMonkeyId, ifFalseMonkeyId} = monkeyCode.match(finalRegex)?.groups ?? {}


    return new Monkey(
      parseInt(monkeyId),
      itemsList.split(', ').map(num => parseInt(num)),
      first === 'old' ? first : parseInt(first),
      second === 'old' ? second : parseInt(second),
      operator as '+'|'*',
      parseInt(divisor),
      parseInt(ifTrueMonkeyId),
      parseInt(ifFalseMonkeyId),
      divideWorryLevel,
    )
  }

  private performCalculation(item: number) {
    const first = this.first === 'old' ? item : this.first
    const second = this.second === 'old' ? item : this.second

    switch(this.operator) {
      case '*': 
        return first * second
      case '+':
        return first + second
      default:
        throw 'unknown operator' + this.operator
    }
  }

  private testItem(item: number) {
    return item % this.divisor === 0
  }

  private inspectItem(item: number) {
    this.inspectCount++

    let newItem = this.performCalculation(item)
    if (this.divideWorryLevel) {
      newItem = Math.floor(newItem / 3)
    }

    return {
      newItem,
      monkeyId: this.testItem(newItem) ? this.ifTrueMonkeyId : this.ifFalseMonkeyId
    }
  }

  catchItem(item: number) {
    this.itemsList.push(item)
  }

  *processItems() {
    while (this.itemsList.length > 0) {
      yield this.inspectItem(this.itemsList.shift()!)
    }
  }

  report() {
    console.log(`Monkey ${this.monkeyId}: ${this.itemsList}`)
    console.log(`Monkey ${this.monkeyId} inspected ${this.inspectCount} times`)
  }
}

class MonkeyManager {
  private monkeys: Monkey[] = []
  constructor(
    private divideWorryLevel: boolean,
    private rounds: number
  ) {}

  readMonkeys(input: string) {
    this.monkeys = input.split('\n\n').map(code => Monkey.fromString(code, this.divideWorryLevel))
    return this
  }

  simulateMonkeys() {
    const monkeyMap = new Map(this.monkeys.map(monkey => [monkey.monkeyId, monkey]))
    const divisor = this.monkeys.map(monkey => monkey.divisor).reduce((a,b) => a*b, 1) 

    for (let i = 0; i<this.rounds; i++) {
      for (const monkey of this.monkeys) {
        for (const {newItem, monkeyId} of monkey.processItems()) {
          monkeyMap.get(monkeyId)?.catchItem(this.divideWorryLevel ? newItem : newItem % divisor)
        }
      }
    }

    return this
  }

  calculateMonkeyBusiness() {
    const [first, second] = this.monkeys.map(monkey => monkey.inspectCount).sort((a,b) => b-a)

    return first * second
  }
}


function solve1(input: string) {
  const manager = new MonkeyManager(true, 20)
  manager.readMonkeys(input)
  manager.simulateMonkeys()

  console.log(manager.calculateMonkeyBusiness())
}

function solve2(input: string) {
  const manager = new MonkeyManager(false, 10_000)
  manager.readMonkeys(input)
  manager.simulateMonkeys()

  console.log(manager.calculateMonkeyBusiness())
}

solve1(readFileSync('./input.txt', {encoding: 'utf-8'}))
solve2(readFileSync('./input.txt', {encoding: 'utf-8'}))
