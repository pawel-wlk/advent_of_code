import { readFileSync } from "fs"

enum Axis {
  HORIZONTAL = 0,
  VERTICAL = 1,
}

type Direction = 'R'|'U'|'L'|'D'

class Knot {
  position: [number, number] = [0, 0]

  locationsVisited = new Set<string>(['0,0'])

  constructor(public nextKnot?: Knot) {}

  directionMap = {
    'R': {
      axis: Axis.HORIZONTAL,
      speed: 1,
    },
    'L': {
      axis: Axis.HORIZONTAL,
      speed: -1,
    },
    'U': {
      axis: Axis.VERTICAL,
      speed: 1,
    },
    'D': {
      axis: Axis.VERTICAL,
      speed: -1,
    },
  }

  moveInDirection(direction: Direction, distance: number) {
    for (let i = 0; i<distance; i++) {
      const {axis, speed} = this.directionMap[direction]
      this.position[axis] += speed

      this.locationsVisited.add(this.position.join(','))
      this.moveNextKnot()
    }
  }

  moveTo(newPosition: [number, number]) {
    this.position = newPosition

    this.locationsVisited.add(this.position.join(','))
    this.moveNextKnot()
  }

  private areKnotsWithinDistance(distance: number, axis: Axis) {
    if (!this.nextKnot) {
      throw 'no next knot'
    }

    return Math.abs(this.position[axis] - this.nextKnot.position[axis]) === distance
  }

  private moveNextKnotInOneAxis(axis: Axis) {
    if (!this.nextKnot) {
      throw 'no next knot'
    }

    const newPosition = [...this.nextKnot.position] as [number, number]
    newPosition[axis] = (this.position[axis] + newPosition[axis]) / 2

    this.nextKnot.moveTo(newPosition)
  }

  private moveNextKnotSemiDiagonally(primaryAxis: Axis) {
    if (!this.nextKnot) {
      throw 'no next knot'
    }

    const secondaryAxis = primaryAxis === Axis.VERTICAL ?
      Axis.HORIZONTAL :
      Axis.VERTICAL

    const newPosition = [...this.nextKnot.position] as [number, number]
    newPosition[primaryAxis] = (this.position[primaryAxis] + newPosition[primaryAxis]) / 2
    newPosition[secondaryAxis] = this.position[secondaryAxis]

    this.nextKnot.moveTo(newPosition)
  }

  private moveNextKnotDiagonally() {
    if (!this.nextKnot) {
      throw 'no next knot'
    }

    const newPosition = [...this.nextKnot.position] as [number, number]
    newPosition[Axis.VERTICAL] = (this.position[Axis.VERTICAL] + newPosition[Axis.VERTICAL]) / 2
    newPosition[Axis.HORIZONTAL] = (this.position[Axis.HORIZONTAL] + newPosition[Axis.HORIZONTAL]) / 2

    this.nextKnot.moveTo(newPosition)
  }

  private moveNextKnot() {
    if (!this.nextKnot) {
      return
    }

    if (this.areKnotsWithinDistance(0, Axis.HORIZONTAL) && this.areKnotsWithinDistance(2, Axis.VERTICAL)) {
      this.moveNextKnotInOneAxis(Axis.VERTICAL)
    } else if (this.areKnotsWithinDistance(0, Axis.VERTICAL) && this.areKnotsWithinDistance(2, Axis.HORIZONTAL)) {
      this.moveNextKnotInOneAxis(Axis.HORIZONTAL)
    } else if (this.areKnotsWithinDistance(2, Axis.VERTICAL) && this.areKnotsWithinDistance(1, Axis.HORIZONTAL)) {
      this.moveNextKnotSemiDiagonally(Axis.VERTICAL)
    } else if (this.areKnotsWithinDistance(2, Axis.HORIZONTAL) && this.areKnotsWithinDistance(1, Axis.VERTICAL)) {
      this.moveNextKnotSemiDiagonally(Axis.HORIZONTAL)
    } else if (this.areKnotsWithinDistance(2, Axis.HORIZONTAL) && this.areKnotsWithinDistance(2, Axis.VERTICAL)) {
      this.moveNextKnotDiagonally()
    }
  }
}

function readInput(input: string, head: Knot) {
  input.split('\n').forEach(line => {
    const [direction, distance] = line.split(' ') as [Direction, string]

    head.moveInDirection(direction, parseInt(distance))
  })
}

function solve1(input: string) {
  const tail = new Knot()
  const head = new Knot(tail)

  readInput(input, head)

  console.log(tail.locationsVisited.size)
}

function solve2(input: string) {
  const tail = new Knot()
  let head = tail
  for (let i = 8; i >= 0; i--) {
    head = new Knot(head)
  }

  readInput(input, head)

  console.log(tail.locationsVisited.size)
}

// solve1(`R 4
// U 4
// L 3
// D 1
// R 4
// D 1
// L 5
// R 2`)

solve1(readFileSync('./input.txt', {encoding: 'utf-8'}))

// solve2(`R 5
// U 8
// L 8
// D 3
// R 17
// D 10
// L 25
// U 20`)

solve2(readFileSync('./input.txt', {encoding: 'utf-8'}))