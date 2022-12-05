import {readFileSync} from 'fs'

const data = readFileSync('./input.txt', { encoding: 'utf-8' })

const [cargoChart, instructions] = data.split('\n\n')

const splittedCargoChart = cargoChart.split('\n')

const lastLine = splittedCargoChart[splittedCargoChart.length - 1]

const parsedCargoChart: Record<string, string> = {}

Array.from(lastLine).map((char, idx) => {
  if (char == ' ') {
    return
  }

  parsedCargoChart[char] = splittedCargoChart
    .map(line => line[idx])
    .reverse()
    .join('')
    .trim()
    .slice(1)
})


console.log(parsedCargoChart)

const parsedInstructions = instructions.split('\n')
  .map(line => line.match(
    /^move (?<amount>\d+) from (?<from>\d+) to (?<to>\d+)$/
  )?.groups ?? {})

parsedInstructions.forEach((instruction) => {
  // Array.from({ length: Number(instruction.amount) ?? 0 }).forEach(() => {
  //   const movedContainer = parsedCargoChart[instruction.from].slice(-1)
  //   parsedCargoChart[instruction.from] = parsedCargoChart[instruction.from].slice(0, -1)
  //   parsedCargoChart[instruction.to] += movedContainer
  // })
  const movedContainers = parsedCargoChart[instruction.from].slice(-Number(instruction.amount))
  parsedCargoChart[instruction.from] = parsedCargoChart[instruction.from].slice(0, -Number(instruction.amount))
  parsedCargoChart[instruction.to] += movedContainers
})

const topContainers = Object.values(parsedCargoChart).map(containers => containers.slice(-1)).join('')

console.log(topContainers)