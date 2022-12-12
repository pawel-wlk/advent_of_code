import { readFileSync } from "fs"

function* parseInput(input: string) {
  let clock = 0
  let register = 1

  for (const line of input.split('\n')) {
    // console.log(line, clock, register)
    if (line === 'noop') {
      clock++

      yield {
        clock,
        register
      }
    } else {
      const [, value] = line.split(' ')

      clock++

      yield {
        clock,
        register,
      }

      clock++

      yield {
        clock,
        register
      }

      register += parseInt(value)
    }
  }
}

function solve1() {
  const input = readFileSync('./input.txt', {encoding: 'utf-8'})
  let result = 0

  for (const {clock, register} of parseInput(input)) {
    if ((clock - 20) % 40 === 0) {
      console.log(clock, register)
      result += register*clock
    }
  }

  return result
}

function solve2() {
  const input = readFileSync('./input.txt', {encoding: 'utf-8'})
  let result = ''

  for (const {clock, register} of parseInput(input)) {
    const horizontalPosition = (clock-1) % 40

    if (horizontalPosition === 0) [
      result += '\n'
    ]

    if (Math.abs(register - horizontalPosition) <= 1) {
      result += '#'
    } else {
      result += '.'
    }
  }

  return result
}

console.log(solve1())
console.log(solve2())
