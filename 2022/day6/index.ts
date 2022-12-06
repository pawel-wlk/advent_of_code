import {readFileSync} from 'fs'

function findStartMessage(signal: string, minDistinctCharsNumber = 4) {
  for (let i = minDistinctCharsNumber; i < signal.length; i++) {
    const chars = new Set(signal.slice(i-minDistinctCharsNumber, i)) 
    if ([...chars].length == minDistinctCharsNumber) {
      return i
    }
  }

  return -1
}

// console.log(findStartMessage('bvwbjplbgvbhsrlpgdmjqwftvncz'))
// console.log(findStartMessage('nppdvjthqldpwncqszvftbrmjlhg'))
// console.log(findStartMessage('nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg'))
// console.log(findStartMessage('zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw'))
const data = readFileSync('./input.txt', { encoding: 'utf-8' })
console.log(findStartMessage(data))
console.log(findStartMessage(data, 14))