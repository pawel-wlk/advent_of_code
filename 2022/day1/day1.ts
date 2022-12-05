import {readFileSync} from 'fs'

const data = readFileSync('./input.txt', { encoding: 'utf-8' })

const elves = data
  .split('\n\n')
  .map(elf => elf.split('\n').reduce((a,b) => a + Number(b), 0))


console.log(Math.max(...elves))

const sumOfTop3Elves = elves.sort((a,b) => b-a).slice(0, 3).reduce((a,b) => a+b)

console.log(sumOfTop3Elves)