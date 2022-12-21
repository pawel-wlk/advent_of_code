import { readFileSync } from "fs"

type Operation = '+' | '-' | '*' | '/' | '='
interface MonkeyMath {
  first: string,
  second: string,
  operation: Operation
}

function performMath(operations: Map<string, number|MonkeyMath>, monkeyId = 'root'): number {
  const monkey = operations.get(monkeyId)

  if (!monkey) {
    throw 'wrong id'
  }

  if (typeof monkey === 'number') {
    return monkey
  }

  const first = performMath(operations, monkey.first)
  const second = performMath(operations, monkey.second)

  switch (monkey.operation) {
    case '+':
      return first + second
    case '-':
      return first - second
    case '*':
      return first * second
    case '/':
      return first / second
    case '=':
      return first
  }
}

function swapOperations(operations: Map<string, number|MonkeyMath>, currentUnknown = 'humn', prevUnknowns = [] as string[]) {
  const result = [...operations].find(([id, monkey]) => !prevUnknowns.includes(id) && typeof monkey !== 'number' && (monkey.first === currentUnknown || monkey.second === currentUnknown))

  if (!result) {
    throw 'wrong id'
  }

  const [foundId, monkey] = result

  if (typeof monkey === 'number') throw 'should not occur'

  if (foundId === 'root') {
    if (monkey.first === currentUnknown) {
      operations.set(currentUnknown, {
        first: monkey.second,
        operation: '=',
        second: monkey.second,
      })
    } else {
      operations.set(currentUnknown, {
        first: monkey.first,
        operation: '=',
        second: monkey.first,
      })
    }

    return operations
  }

  if (monkey.first === currentUnknown) {
    switch (monkey.operation) {
      case '+':
        operations.set(currentUnknown, {
          first: foundId,
          operation: '-',
          second: monkey.second
        })
        break
      case '-':
        operations.set(currentUnknown, {
          first: foundId,
          operation: '+',
          second: monkey.second,
        })
        break
      case '*':
        operations.set(currentUnknown, {
          first: foundId,
          operation: '/',
          second: monkey.second,
        })
        break
      case '/':
        operations.set(currentUnknown, {
          first: foundId,
          operation: '*',
          second: monkey.second,
        })
        break
    }
  } else {
    switch (monkey.operation) {
      case '+':
        operations.set(currentUnknown, {
          first: foundId,
          operation: '-',
          second: monkey.first
        })
        break
      case '-':
        operations.set(currentUnknown, {
          first: monkey.first,
          operation: '-',
          second: foundId,
        })
        break
      case '*':
        operations.set(currentUnknown, {
          first: foundId,
          operation: '/',
          second: monkey.first,
        })
        break
      case '/':
        operations.set(currentUnknown, {
          first: monkey.first,
          operation: '/',
          second: foundId,
        })
        break
    }
  }

  swapOperations(operations, foundId, [...prevUnknowns, currentUnknown])

  return operations
}

function parseInput(input: string) {
  const operations = new Map<string, number|MonkeyMath>()
  input.split('\n').forEach(line => {
    const [id, rest] = line.split(': ')
    const restAsNumber = parseInt(rest)

    if (!Number.isNaN(restAsNumber)) {
      operations.set(id, restAsNumber)
    } else {
      const [first, operation, second] = rest.split(' ')

      operations.set(id, {
        first,
        second,
        operation: operation as Operation
      })
    }
  })

  return operations
}

const testInput = `root: pppw + sjmn
dbpl: 5
cczh: sllz + lgvd
zczc: 2
ptdq: humn - dvpt
dvpt: 3
lfqf: 4
humn: 5
ljgn: 2
sjmn: drzm * dbpl
sllz: 4
pppw: cczh / lfqf
lgvd: ljgn * ptdq
drzm: hmdt - zczc
hmdt: 32`

const input = readFileSync('./input.txt', {encoding: 'utf-8'})
console.log(performMath(parseInput(testInput)))
console.log(performMath(parseInput(input)))

console.log(performMath(swapOperations(parseInput(testInput)), 'humn'))
console.log(performMath(swapOperations(parseInput(input)), 'humn'))