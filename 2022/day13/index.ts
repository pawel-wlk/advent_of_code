import { readFileSync } from "fs"

type Value = number | Value[]

enum Order {
  RIGHT = 1,
  WRONG = -1,
  EQUAL = 0,
}

function compare(left: Value, right: Value): Order {
  if (typeof left === 'number' && typeof right === 'number') {
    if (left < right) {
      return Order.RIGHT
    }
    if (left > right) {
      return Order.WRONG
    }

    return Order.EQUAL
  }

  if (typeof left === 'number') {
    return compare([left], right)
  }
  if (typeof right === 'number') {
    return compare(left, [right])
  }

  let leftVal: Value|undefined, rightVal: Value|undefined
  let order = Order.EQUAL

  for (let i = 0; order === Order.EQUAL; i++) {
    leftVal = left[i]
    rightVal = right[i]
    if (leftVal === undefined && rightVal === undefined) {
      return Order.EQUAL
    }

    if (leftVal === undefined) {
      return Order.RIGHT
    }

    if (rightVal === undefined) {
      return Order.WRONG
    }

    order = compare(leftVal, rightVal)
  }

  return order
}

function* parseInput(input: string) {
  for (const group of input.split('\n\n')) {
    const [leftStr, rightStr] = group.split('\n')
    yield [JSON.parse(leftStr), JSON.parse(rightStr)] as [Value, Value]
  }
}
function* parseInputAsOne(input: string) {
  for (const [left, right] of parseInput(input)) {
    yield left
    yield right
  }
}

function solve(input: string) {
  let index = Order.RIGHT
  let result = 0
  for (const [left, right] of parseInput(input)) {
    const comparison = compare(left, right)
    if (comparison === Order.RIGHT) {
      result += index
    }
    if (comparison === Order.EQUAL) {
      console.log('comparison incomplete')
      console.log(JSON.stringify([left, right], null, 2))
    }

    index++
  }

  return result
}

function isDividerPacket(packet: Value, dividerValue: number) {
  return typeof packet !== 'number' &&
  packet.length === 1 &&
  typeof packet[0] !== 'number' &&
  packet[0].length === 1 &&
  packet[0][0] === dividerValue
}

function solve2(input: string) {
  const packets = [...parseInputAsOne(input), [[2]], [[6]]]
  
  const sortedPackets =  packets.sort((a,b) => compare(b, a))

  const firstDividerIndex = sortedPackets.findIndex(packet => isDividerPacket(packet, 2)) + 1
  const secondDividerIndex = sortedPackets.findIndex(packet => isDividerPacket(packet, 6)) + 1

  return firstDividerIndex * secondDividerIndex
}

const input = readFileSync('./input.txt', {encoding: 'utf-8'})
console.log(solve(input))
console.log(solve2(input))