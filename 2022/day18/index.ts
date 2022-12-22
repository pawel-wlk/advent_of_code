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

function isAirPocket(cube: Cube, cubes: Cube[]) {
  const isAlreadyPresent = cubes.find(([x,y,z]) => x === cube[0] && y === cube[1] && z === cube[2])

  if (isAlreadyPresent) return false

  const adjacentCubes = cubes.filter(isCubeAdjacentTo(cube))

  return adjacentCubes.length === 6
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
