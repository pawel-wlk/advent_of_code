import { readFileSync } from "fs";

const input = readFileSync('./input.txt', {encoding: 'utf-8'})
const testInput = `1
2
-3
3
-2
0
4`

function parseInput(input: string) {
  return input.split('\n').map(line => parseInt(line))
}

function verifyArray(array: number[]) {
  return (new Set(array)).size === array.length
}

console.log(verifyArray(parseInput(testInput)))
console.log(verifyArray(parseInput(input)))

interface IdentifiableNumber {
  value: number
  id: number
}

function modulo(a: number, b: number) {
  return ((a % b) + b) % b
}

function moveElement(array: IdentifiableNumber[], index: number) {
  const identifiable = array[index]
  if (identifiable.value === 0) return

  let addedIndex = index+identifiable.value
  const newIndex = modulo(addedIndex, array.length-1)

  array.splice(index, 1)

  if (identifiable.value < 0 && newIndex === 0) array.push(identifiable)
  else array.splice(newIndex, 0, identifiable)
}

function makeArrayIdentifiable(array: number[]) {
  return array.map((value, id) => ({value, id}))
}


function mixArray(identifiableArray: IdentifiableNumber[]) {
  let greatestMovedId = 0

  while (greatestMovedId < identifiableArray.length) {
    const i = identifiableArray.findIndex(({id}) => id === greatestMovedId)
    // console.log('moving', identifiableArray[i].value)
    moveElement(identifiableArray, i)
    greatestMovedId++
    // console.log(identifiableArray.map(({value}) => value))
  }
}

function identifiableArrayToNormal(identifiableArray: IdentifiableNumber[]) {
  return identifiableArray.map(({value}) => value)
}

function findCriticalValues(array: number[]) {
  const zeroIndex = array.indexOf(0)

  return array[(zeroIndex + 1000) % array.length] +
    array[(zeroIndex + 2000) % array.length] +
    array[(zeroIndex + 3000) % array.length]
}

function decryptFirst(array: number[]) {
  const identifiable = makeArrayIdentifiable(array)
  mixArray(identifiable)

  return findCriticalValues(
    identifiableArrayToNormal(identifiable)
  )
}

function decrypt(array: number[]) {
  const encryptionKey = 811589153

  const keyed = array.map(a => a*encryptionKey)

  const identifiable = makeArrayIdentifiable(keyed)

  for (let i = 0; i<10; i++) {
    mixArray(identifiable)
  }
  return findCriticalValues(
    identifiable.map(({value}) => value)
  )
}

console.log(decryptFirst(parseInput(testInput)))
console.log(decryptFirst(parseInput(input)))

console.log(decrypt(parseInput(testInput)))
console.log(decrypt(parseInput(input)))
