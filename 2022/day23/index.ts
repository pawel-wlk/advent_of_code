import { readFileSync } from "fs"

const isPointEqualTo = <T extends readonly [number, number]>([x, y]: T) => ([xx, yy]: T) => x === xx && y === yy

class ElvesHive {
  private directionsQueue = ['N', 'S', 'W', 'E'] as Array<'N'|'S'|'W'|'E'>
  constructor(
    private elves: Array<readonly [number, number]>,
  ) {}

  private findNeighbors: Record<'N'|'S'|'W'|'E', (elf: readonly [number, number]) => Array<readonly[number, number]>> = {
    N: ([x, y]) => [[x, y-1], [x-1, y-1], [x+1, y-1]], 
    S: ([x, y]) => [[x, y+1], [x-1, y+1], [x+1, y+1]], 
    W: ([x, y]) => [[x-1, y], [x-1, y-1], [x-1, y+1]], 
    E: ([x, y]) => [[x+1, y], [x+1, y-1], [x+1, y+1]], 
  }

  private adjustDirections() {
    this.directionsQueue.push(this.directionsQueue.shift()!)
  }

  private makeMovePropositions() {
    return this.elves.map(elf => {
      for (const direction of this.directionsQueue) {
        const neighbors = this.findNeighbors[direction](elf)

        const areNeighborsFree = neighbors.every(field => !this.elves.find(isPointEqualTo(field)))

        if (areNeighborsFree) return neighbors[0]
      }

      return elf
    })
  }

  private validatePropositions(propositions: Array<readonly [number, number]>) {
    return propositions.map((proposition, i) => {
      const equalProposition = propositions.find(isPointEqualTo(proposition))

      if (equalProposition) {
        return this.elves[i]
      }

      return proposition
    })
  }

  move() {
    const propositions = this.makeMovePropositions()
    this.elves = this.validatePropositions(propositions)

    this.adjustDirections()
  }

  findEmptyFieldsOverlappingRectangle() {
    const xs = this.elves.map(([x]) => x)
    const minX = xs.reduce((a,b) => Math.min(a,b), Infinity)
    const maxX = xs.reduce((a,b) => Math.max(a,b), 0)

    const ys =this.elves.map(([,y]) => y)
    const minY = ys.reduce((a,b) => Math.min(a,b), Infinity)
    const maxY = ys.reduce((a,b) => Math.max(a,b), 0)

    const area = (maxY - minY + 1) * (maxX - minX + 1)
    // console.log(maxY, minY, maxX, minX, this.elves.length)

    return area - this.elves.length
  }

  simulate(rounds: number) {
    for (let i = 0; i < rounds; i++) {
      this.move()
    }

    return this.findEmptyFieldsOverlappingRectangle()
  }

  static fromString(input: string) {
    const elves = input.split('\n').flatMap((line, y) => line.split('').map((char, x) => {
      if (char === '#') return [x, y] as const

      return null
    })).filter((x): x is readonly [number, number] => !!x)
    
    return new ElvesHive(elves)
  }
}

console.log(ElvesHive.fromString(`......#.....
..........#.
.#.#..#.....
.....#......
..#.....#..#
#......##...
....##......
.#........#.
...#.#..#...
............
...#..#..#..`).simulate(10))

const input = readFileSync('./input.txt', {encoding: 'utf-8'})

console.log(ElvesHive.fromString(input).simulate(10))