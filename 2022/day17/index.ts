import { readFileSync } from "fs"

type Shape = Array<readonly [number, number]>

class Cave {
  public gasIndex = 0
  private leftWall = 0
  private rightWall = 8
  private highestPoint = 0
  private fallenRocksObject: Record<number, Record<number, boolean|undefined>> = {}
  public shapeIndex: 0|1|2|3|4 = 0
  private floor = 0
  constructor(
    private gasPattern: string
  ) {}

  getHeight() {
    return this.highestPoint
  }

  getTopRowCoverage() {
    return Array.from({ length: 7 }).map((_, i) => this.fallenRocksObject[i+1]?.[this.highestPoint])
  }

  isTopRowSufficientlyCovered() {
    if (this.highestPoint === 0) return false
    const coverage = this.getTopRowCoverage()

    for (let i=0; i<coverage.length-3; i++) {
      if (!coverage[i] && !coverage[i+1] && !coverage[i+2] && !coverage[i+3]) return false
    }

    return true
  }

  private getGasMovement() {
    const direction = this.gasPattern[this.gasIndex]
    this.gasIndex = (this.gasIndex + 1) % this.gasPattern.length

    return direction === '>' ? 1 : -1
  }

  private shapeIntersectsWithWall(shape: Shape) {
    return shape.some(([x]) => x === this.leftWall || x === this.rightWall)
  }

  private shapeIntersectsWithBottom(shape: Shape) {
    return shape.some(([x, y]) => y === this.floor)
  }

  private shapeIntersectsWithRock(shape: Shape) {
    return shape.some(([x, y]) => this.fallenRocksObject[x]?.[y])
  }

  private spawnShape() {
    let shape: Shape
    const leftMostPoint = this.leftWall + 3
    const bottomPoint = this.highestPoint + 4

    switch (this.shapeIndex) {
      case 0: // -
        shape = [
          [leftMostPoint, bottomPoint] as const,
          [leftMostPoint+1, bottomPoint] as const,
          [leftMostPoint+2, bottomPoint] as const,
          [leftMostPoint+3, bottomPoint] as const,
        ]
        break
      case 1: // +
        shape = [
          [leftMostPoint, bottomPoint+1] as const,
          [leftMostPoint+1, bottomPoint] as const,
          [leftMostPoint+1, bottomPoint+1] as const,
          [leftMostPoint+1, bottomPoint+2] as const,
          [leftMostPoint+2, bottomPoint+1] as const,
        ]
        break
      case 2: // mirror L
        shape = [
          [leftMostPoint, bottomPoint] as const,
          [leftMostPoint+1, bottomPoint] as const,
          [leftMostPoint+2, bottomPoint] as const,
          [leftMostPoint+2, bottomPoint+1] as const,
          [leftMostPoint+2, bottomPoint+2] as const,
        ]
        break
      case 3: // I
        shape = [
          [leftMostPoint, bottomPoint] as const,
          [leftMostPoint, bottomPoint+1] as const,
          [leftMostPoint, bottomPoint+2] as const,
          [leftMostPoint, bottomPoint+3] as const,
        ]
        break
      case 4: // square
        shape = [
          [leftMostPoint, bottomPoint] as const,
          [leftMostPoint+1, bottomPoint] as const,
          [leftMostPoint, bottomPoint+1] as const,
          [leftMostPoint+1, bottomPoint+1] as const,
        ]
        break
    }


    this.shapeIndex = (this.shapeIndex + 1) % 5 as 0|1|2|3|4

    return shape
  }

  private addToFallenRocks(shape: Shape) {
    shape.forEach(([x, y]) => {
      if (!this.fallenRocksObject[x]) this.fallenRocksObject[x] = {}
      this.fallenRocksObject[x][y] = true
    })

    this.highestPoint = Math.max(
      this.highestPoint,
      shape.map(([,y]) => y).reduce((a,b) => Math.max(a,b), 0)
    )
  }

  simulateRocks(maxFallenRocks: number) {
    let numberOfFallenRocks = 0
    let currentFallingShape: Shape = this.spawnShape()

    while (numberOfFallenRocks < maxFallenRocks) {
      const gasMovement = this.getGasMovement()
      const gasMovedShape = currentFallingShape.map(([x, y]) => [x+gasMovement, y] as const)

      if (!this.shapeIntersectsWithWall(gasMovedShape) && !this.shapeIntersectsWithRock(gasMovedShape)) {
        currentFallingShape = gasMovedShape
      }

      const movedDownShape = currentFallingShape.map(([x, y]) => [x, y-1] as const)

      if (this.shapeIntersectsWithBottom(movedDownShape) || this.shapeIntersectsWithRock(movedDownShape)) {
        this.addToFallenRocks(currentFallingShape)
        numberOfFallenRocks++

        currentFallingShape = this.spawnShape()
      } else {
        currentFallingShape = movedDownShape
      }
    }
  }
}

let cave: Cave
cave = new Cave('>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>')
cave.simulateRocks(2022)
console.log(cave.getHeight())

const input = readFileSync('./input.txt', {encoding: 'utf-8'})
cave = new Cave(input)
cave.simulateRocks(2022)
console.log(cave.getHeight())

function findOutRequiredCycleLen(input: string) {
  const cave = new Cave(input)
  let cyclesDone = 0
  cave.simulateRocks(10)
  cyclesDone += 10
  const initialGasIndex = cave.gasIndex
  do {
    cave.simulateRocks(5)
    cyclesDone += 5
  } while (cave.gasIndex !== initialGasIndex) 

  console.log('FOUND', cyclesDone)

  return cyclesDone
}

function solve2(input: string) {
  const target = 1000000000000
  const len = findOutRequiredCycleLen(input)
  const multiplier = Math.floor(target / len)
  const remainder = target - (multiplier * len)

  const cave = new Cave(input)

  cave.simulateRocks(len)
  const cycleHeight = cave.getHeight()

  cave.simulateRocks(remainder)
  const remainderHeight = cave.getHeight()

  return (cycleHeight * multiplier) + remainderHeight
}

console.log('RESULTS')
console.log(solve2('>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>'))
console.log(solve2(input))