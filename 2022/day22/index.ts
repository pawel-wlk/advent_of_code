import { readFileSync } from "fs"

type FieldMap = Array<Array<'.'|'#'|undefined>>

const directions = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
]

function findLastIndex<T>(array: T[], predicate: (element: T) => boolean) {
  for (let i = array.length-1; i>=0; i--) {
    if (predicate(array[i])) {
      return i
    }
  }

  throw 'not found'
}
const isNotUndefined = <T>(tile: T|undefined): tile is T => tile !== undefined
const isNotUndefinedAt = (x: number) => <T>(row: Array<T|undefined>)=> row[x] !== undefined 

class FieldExplorer {
  public x: number
  public y: number
  public currentDirectionIndex = 0

  constructor(
    private map: FieldMap
  ) {
    this.x = this.map[0].indexOf('.'),
    this.y = 0
  }

  public turn(dir: 'R'|'L') {
    if (dir === 'R') {
      this.currentDirectionIndex = (this.currentDirectionIndex+1) % directions.length
    } else if (this.currentDirectionIndex === 0) {
      this.currentDirectionIndex = directions.length - 1
    } else {
      this.currentDirectionIndex--
    }
  }

  public move(steps: number) {
    const [xDir, yDir] = directions[this.currentDirectionIndex]

    let stepsMoved = 0

    while (stepsMoved < steps) {
      let nextX = this.x + xDir
      let nextY = this.y + yDir

      if (this.map[nextY]?.[nextX] === undefined) {
        if (xDir === 1) {
          nextX = this.map[this.y].findIndex(isNotUndefined)
        } else if (xDir === -1) {
          nextX = findLastIndex(this.map[this.y], isNotUndefined)
        } else if (yDir === 1) {
          nextY = this.map.findIndex(isNotUndefinedAt(this.x))
        } else if (yDir === -1) {
          nextY = findLastIndex(this.map, isNotUndefinedAt(this.x))
        }
      }

      if (this.map[nextY]?.[nextX] === '#') {
        break
      }

      this.x = nextX
      this.y = nextY
      // console.log(this.x, this.y)

      stepsMoved++
    }
  }
}

function moveExplorer(instructions: string, explorer: FieldExplorer) {
  const regex = /^(?<currentInstruction>\d+|[RL])(?<remainingInstructions>.*)$/

  let currentInstruction: string = ''
  let remainingInstructions = instructions

  while (remainingInstructions.length) {
    const groups = remainingInstructions.match(regex)?.groups ?? {};
    ({currentInstruction, remainingInstructions} = groups)

    if (currentInstruction === 'R' || currentInstruction === 'L') {
      explorer.turn(currentInstruction as 'R'|'L')
    } else {
      explorer.move(parseInt(currentInstruction))
    }
  }
}

function parseMap(map: string): FieldMap {
  return map.split('\n')
    .map(line => [...line].map((char) => {
      if (char === '#' || char === '.') return char

      return undefined
    }))
}

function solve(input: string) {
  const [map, instructions] = input.split('\n\n')

  const explorer = new FieldExplorer(parseMap(map))

  moveExplorer(instructions, explorer)
  // console.log(explorer.x)
  // console.log(explorer.y)

  const x = explorer.x + 1
  const y = explorer.y + 1

  return (x * 4) + (y * 1000) + explorer.currentDirectionIndex
}


console.log(
  solve(`        ...#
        .#..
        #...
        ....
...#.......#
........#...
..#....#....
..........#.
        ...#....
        .....#..
        .#......
        ......#.

10R5L5R10L4R5L5`)
)

const input = readFileSync('./input.txt', {encoding: 'utf-8'})

console.log(solve(input))

