import { readFileSync } from "fs"

function getElevation(char: string) {
  if (char === 'S') {
    return 'a'.charCodeAt(0)
  }
  if (char == 'E') {
    return 'z'.charCodeAt(0)
  }

  return char.charCodeAt(0)
}

function findPoint(map: string[][], point = 'S'): [number, number] {
  for (let i=0; i<map.length; i++) {
    const j = map[i].findIndex(char => char === point)
    if (j !== -1) {
      return [i, j]
    }
  }

  return [-1, -1]
}

function findShortestPaths(map: string[][], [fromI, fromJ]: readonly [number, number], goals: string[]): number {
  const visitedLocations: number[][] = Array.from({ length: map.length }).map(() => [])
  const queue = [[fromI, fromJ] as const]
  let current: typeof queue [number] |undefined

  visitedLocations[fromI][fromJ] = 0

  while (current = queue.shift()) {
    const [currentI, currentJ] = current

    if (goals.includes(map[currentI][currentJ])) {
      return visitedLocations[currentI][currentJ]
    } 

    const neighbors = [
      [currentI-1, currentJ],
      [currentI+1, currentJ],
      [currentI, currentJ-1],
      [currentI, currentJ+1],
    ] as const

    const currentElevation = getElevation(map[currentI][currentJ])

    const viableNeighbors = neighbors.filter(
      ([i, j]) => i >= 0 && j >= 0 &&
        i < map.length && j < map[i].length &&
        visitedLocations[i][j] === undefined &&
        currentElevation - getElevation(map[i][j]) <= 1
    )

    viableNeighbors.forEach(([i, j]) => {
      visitedLocations[i][j] = visitedLocations[currentI][currentJ] + 1
      queue.push([i,j])
    })
  }

  return Infinity
}

function solve(input: string) {
  const map = input.split('\n').map(line => [...line]) 

  console.log(findShortestPaths(map, findPoint(map, 'E'), ['S']))
  console.log(findShortestPaths(map, findPoint(map, 'E'), ['S', 'a']))
}

solve(readFileSync('./input.txt', {encoding: 'utf-8'}))