import {readFileSync} from 'fs'

const data = readFileSync('./input.txt', { encoding: 'utf-8' })

const scoreLetters = (letter: string) => {
  if (letter == letter.toUpperCase()) {
    return letter.charCodeAt(0) - 38
  }
  return letter.charCodeAt(0) - 96
}


const rucksacks = data.split('\n')

const wrongItems = rucksacks.map(rucksack => {
  const firstCompartment = [...rucksack.slice(0, rucksack.length / 2)]
  const secondCompartment = [...rucksack.slice(rucksack.length/2)]

  return firstCompartment.find(item => secondCompartment.includes(item))
})

console.log(wrongItems.reduce((sum, item) => sum + scoreLetters(item as string), 0))


const commonItems: (string|undefined)[] = []
for (let i = 0; i < rucksacks.length; i+=3) {
  const commonItem = [...rucksacks[i]].find(item => rucksacks[i+1].includes(item) && rucksacks[i+2].includes(item))
  commonItems.push(commonItem)
}

console.log(commonItems)
console.log(commonItems.reduce((sum, item) => sum + scoreLetters(item as string), 0))
