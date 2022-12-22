import { readFileSync } from "fs"

type Cube = readonly [number, number, number]

function isCubeAdjacentTo([x, y, z]: Cube) {
  return ([xx, yy, zz]: Cube) => {
    return (
      (x === xx && y === yy && Math.abs(z - zz) === 1) ||
      (x === xx && z === zz && Math.abs(y - yy) === 1) ||
      (y === yy && z === zz && Math.abs(x - xx) === 1)
    )
  }
}

function countVisibleSides(cubes: Cube[]) {
  return cubes.reduce((result, cube) => {
    const isAdjacent = isCubeAdjacentTo(cube)
    const adjacentCubes = cubes.filter(isAdjacent)
    const freeSides = 6 - adjacentCubes.length

    return result + freeSides
  }, 0)
}

const maximum = (a:number,b:number) => Math.max(a,b)

function* generateTriples(maxX: number, maxY: number, maxZ: number) {
  for (let x = 0; x <= maxX; x++) {
    for (let y = 0; y <= maxY; y++) {
      for (let z = 0; z <= maxZ; z++) {
        yield [x, y, z] as const
      }
    }
  }
}

function isAirPocket(startingCube: Cube, cubes: Cube[], maxX: number, maxY: number, maxZ: number) {
  const isAlreadyPresent = cubes.find(([x,y,z]) => x === startingCube[0] && y === startingCube[1] && z === startingCube[2])

  if (isAlreadyPresent) return false

  const pointsToVisit = [startingCube]
  const alreadyVisited = new Set<string>()
  const allCubes = new Set(cubes.map(cube => cube.join(',')))
  let next: Cube|undefined

  while (next = pointsToVisit.shift()) {
    const [x, y, z] = next

    if (x === 0 || x === maxX || y === 0 || y === maxY || z === 0 || z === maxZ) {
      return false
    }

    const neighbors = [
      [x+1, y, z],
      [x-1, y, z],
      [x, y+1, z],
      [x, y-1, z],
      [x, y, z+1],
      [x, y, z-1],
    ] as const

    const viableNeighbors = neighbors.filter(n => {
      const key = n.join(',')

      return !alreadyVisited.has(key) && !allCubes.has(key)
    })

    viableNeighbors.forEach(neighbor => {
      alreadyVisited.add(neighbor.join(','))
      pointsToVisit.push(neighbor)
    })
  }

  return true
}

function eliminateAirPockets(cubes: Cube[]) {
  const maxX = cubes.map(([x]) => x).reduce(maximum, 0)
  const maxY = cubes.map(([,y]) => y).reduce(maximum, 0)
  const maxZ = cubes.map(([,,z]) => z).reduce(maximum, 0)

  for (const cube of generateTriples(maxX, maxY, maxZ)) {
    if (isAirPocket(cube, cubes, maxX, maxY, maxZ)) cubes.push(cube)
  }
}

function countVisibleSidesWithoutAirPockets(cubes: Cube[]) {
  eliminateAirPockets(cubes)

  return countVisibleSides(cubes)
}

function parseInput(input: string): Cube[] {
  return input.split('\n').map(line => {
    const [x, y, z] = line.split(',').map(x => parseInt(x))

    return [x, y, z] as const
  })
}

const testCubes = parseInput(`2,2,2
1,2,2
3,2,2
2,1,2
2,3,2
2,2,1
2,2,3
2,2,4
2,2,6
1,2,5
3,2,5
2,1,5
2,3,5`)

const cubes = parseInput(readFileSync('./input.txt', {encoding: 'utf-8'}))

console.log(countVisibleSides(testCubes))
console.log(countVisibleSides(cubes))

console.log(countVisibleSidesWithoutAirPockets(testCubes))
console.log(countVisibleSidesWithoutAirPockets(cubes))
