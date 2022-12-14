import { readFileSync } from "fs"

type Rock = readonly [number, number]
type RockPath = Rock[]

function isBetweenRocks(rock: Rock, start: Rock, end: Rock) {
  let equalDimension
  let rangeDimension
  if (start[0] === end[0]) {
    equalDimension = 0
    rangeDimension = 1
  } else if (start[1] === end[1]) {
    equalDimension = 1
    rangeDimension = 0
  } else {
    throw 'unknown dimension'
  }

  if (rock[equalDimension] !== start[equalDimension]) return false

  return (start[rangeDimension] <= rock[rangeDimension] && rock[rangeDimension] <= end[rangeDimension]) ||
    (end[rangeDimension] <= rock[rangeDimension] && rock[rangeDimension] <= start[rangeDimension])
}

function isInPath(rock: Rock, path: RockPath) {
  for (let i = 0; i < path.length-1; i++) {
    const rockA = path[i]
    const rockB = path[i+1]

    if (isBetweenRocks(rock, rockA, rockB)) {
      return true
    }
  }
  
  return false
}

function isInAnyPath(rock: Rock, paths: RockPath[]) {
  return paths.some(path => isInPath(rock, path))
}

function buildSetKey(position: readonly [number, number]) {
  return position.join(',')
}

function dropSand(paths: RockPath[], considerFloor = false) {
  const sands = new Set<string>()
  const lowestRockIndex = paths.flat().map(rock => rock[1]).sort((a,b) => a-b).pop()!
  const floor = lowestRockIndex + 2

  let sandX = 500
  let sandY = 0
  let falling = true
  let sandUnitsAtRest = 0

  while (falling) {
    const possiblePositions = [
      [sandX, sandY+1],
      [sandX-1, sandY+1],
      [sandX+1, sandY+1],
    ] as const

    const newPosition = possiblePositions.find(position => position[1] !== floor &&
      !sands.has(buildSetKey(position)) &&
      !isInAnyPath(position, paths)
    )

    if (newPosition) {
      [sandX, sandY] = newPosition
      if (!considerFloor && sandY > lowestRockIndex) {
        falling = false
      }
    } else {
      sands.add(buildSetKey([sandX, sandY]))
      sandUnitsAtRest++

      if (considerFloor && sandX === 500 && sandY === 0) {
        falling = false
      }

      sandX = 500
      sandY = 0
    }
  }

  return sandUnitsAtRest
}

function parseInput(input: string) {
  return input.split('\n')
    .map(line => line.split(' -> ').map(pair => {
      const [x, y] = pair.split(',').map(val => parseInt(val))

      return [x, y] as const
    }))
}

console.log(dropSand(parseInput(`498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`)))
console.log(dropSand(parseInput(`498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`), true))

const input = readFileSync('./input.txt', {encoding: 'utf-8'})
console.log(dropSand(parseInput(input)))
console.log(dropSand(parseInput(input), true))