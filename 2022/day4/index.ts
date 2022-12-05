import {readFileSync} from 'fs'

const data = readFileSync('./input.txt', { encoding: 'utf-8' })

const overlappingRanges = data.split('\n')
  .filter(line => {
    const match = line.match(
      /^(?<firstStart>\d+)-(?<firstEnd>\d+),(?<secondStart>\d+)-(?<secondEnd>\d+)$/
    )

    const {firstStart, firstEnd, secondStart, secondEnd} = match?.groups ?? {}

    return (Number(firstStart) <= Number(secondStart) && Number(firstEnd) >= Number(secondStart)) ||
      (Number(secondStart) <= Number(firstStart) && Number(secondEnd) >= Number(firstStart))
  })

console.log(overlappingRanges)
console.log(overlappingRanges.length)