import { readFileSync } from "fs"

enum Axis {
  HORIZONTAL = 0,
  VERTICAL = 1,
}

type Direction = 'R'|'U'|'L'|'D'

class Bridge {
  head: [number, number] = [0, 0]
  tail: [number, number] = [0, 0]

  locationsVisitedByTail = new Set<string>()

  constructor() {}

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

  moveHead(direction: Direction, distance: number) {
    for (let i = 0; i<distance; i++) {
      const {axis, speed} = this.directionMap[direction]
      this.head[axis] += speed

      this.moveTail()
    }
  }

  private areEndsWithinDistance(distance: number, axis: Axis) {
    return Math.abs(this.head[axis] - this.tail[axis]) === distance
  }

  private moveTailTowardsHead(axis: Axis) {
    this.tail[axis] = (this.head[axis] + this.tail[axis]) / 2
  }

  private moveTail() {
    if (this.areEndsWithinDistance(0, Axis.HORIZONTAL) && this.areEndsWithinDistance(2, Axis.VERTICAL)) {
      this.moveTailTowardsHead(Axis.VERTICAL)
    } else if (this.areEndsWithinDistance(0, Axis.VERTICAL) && this.areEndsWithinDistance(2, Axis.HORIZONTAL)) {
      this.moveTailTowardsHead(Axis.HORIZONTAL)
    } else if (this.areEndsWithinDistance(2, Axis.VERTICAL) && this.areEndsWithinDistance(1, Axis.HORIZONTAL)) {
      this.tail[Axis.HORIZONTAL] = this.head[Axis.HORIZONTAL]
      this.moveTailTowardsHead(Axis.VERTICAL)
    } else if (this.areEndsWithinDistance(2, Axis.HORIZONTAL) && this.areEndsWithinDistance(1, Axis.VERTICAL)) {
      this.tail[Axis.VERTICAL] = this.head[Axis.VERTICAL]
      this.moveTailTowardsHead(Axis.HORIZONTAL)
    }


    this.locationsVisitedByTail.add(this.tail.join(','))
  }
}

function parseInput(input: string) {
  const bridge = new Bridge()

  input.split('\n').forEach(line => {
    const [direction, distance] = line.split(' ') as [Direction, string]

    bridge.moveHead(direction, parseInt(distance))
  })

  console.log([...bridge.locationsVisitedByTail])
  console.log(bridge.locationsVisitedByTail.size)
}

// parseInput(`R 4
// U 4
// L 3
// D 1
// R 4
// D 1
// L 5
// R 2`)

parseInput(readFileSync('./input.txt', {encoding: 'utf-8'}))