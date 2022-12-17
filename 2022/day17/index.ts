import { readFileSync } from "fs"

type Shape = Array<readonly [number, number]>

class Cave {
  private gasIndex = 0
  private leftWall = 0
  private rightWall = 8
  private highestPoint = 0
  private fallenRocksObject: Record<number, Record<number, boolean|undefined>> = {}
  private shapeIndex: 0|1|2|3|4 = 0
  private floor = 0
  constructor(
    private gasPattern: string
  ) {}

  getHeight() {
    return this.highestPoint
  }

  getGasMovement() {
    const direction = this.gasPattern[this.gasIndex]
    this.gasIndex = (this.gasIndex + 1) % this.gasPattern.length

    return direction === '>' ? 1 : -1
  }

  shapeIntersectsWithWall(shape: Shape) {
    return shape.some(([x]) => x === this.leftWall || x === this.rightWall)
  }

  shapeIntersectsWithBottom(shape: Shape) {
    return shape.some(([x, y]) => y === this.floor)
  }

  shapeIntersectsWithRock(shape: Shape) {
    return shape.some(([x, y]) => this.fallenRocksObject[x]?.[y])
  }

  spawnShape() {
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

  addToFallenRocks(shape: Shape) {
    shape.forEach(([x, y]) => {
      if (!this.fallenRocksObject[x]) this.fallenRocksObject[x] = {}
      this.fallenRocksObject[x][y] = true
    })

    if (this.fall)

    this.highestPoint = Math.max(
      this.highestPoint,
      shape.map(([,y]) => y).reduce((a,b) => Math.max(a,b), 0)
    )
  }

  simulateRocks(maxFallenRocks: number) {
    let numberOfFallenRocks = 0
    let currentFallingShape: Shape = this.spawnShape()

    while (numberOfFallenRocks < maxFallenRocks) {
      if (numberOfFallenRocks % 1_000_000 === 0) console.log(numberOfFallenRocks)
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

cave = new Cave('>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>')
cave.simulateRocks(1_000_000_000_000)
console.log(cave.getHeight())