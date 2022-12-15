import { readFileSync } from "fs"

interface SensorReading {
  sensor: [number, number]
  beacon: [number, number]
}

function measureDistance(a: [number, number], b: [number, number]) {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1])
}

function countImpossiblePositionsInRow(readings: SensorReading[], row: number) {
  const positionsInRow = new Set<number>()

  readings.forEach(({sensor, beacon}) => {
    const beaconDistance = measureDistance(sensor, beacon)

    const rowDistance = Math.abs(row - sensor[1])
    const remainingDistance = beaconDistance - rowDistance

    if (remainingDistance < 0) {
      return
    }

    for (let x = sensor[0] - remainingDistance; x <= sensor[0] + remainingDistance; x++) {
      if (!(x === beacon[0] && row === beacon[1])) positionsInRow.add(x) 
    }
  })

  return positionsInRow.size
}

function parseInput(input: string): SensorReading[] {
  return input.split('\n').map(line => {
    const groups = line.match(
      /^Sensor at x=(?<sensorX>-{0,1}\d+), y=(?<sensorY>-{0,1}\d+): closest beacon is at x=(?<beaconX>-{0,1}\d+), y=(?<beaconY>-{0,1}\d+)/
    )?.groups

    if (!groups) return null

    return {
      sensor: [parseInt(groups.sensorX), parseInt(groups.sensorY)],
      beacon: [parseInt(groups.beaconX), parseInt(groups.beaconY)],
    }
  })
  .filter((x): x is SensorReading => !!x)
}

function calculateTuningFrequency(point: [number, number]) {
  return point[0] * 4_000_000 + point[1]
}

function searchPerimetersForFreePoint(readings: SensorReading[]) {
  const searchSpaceSize = 4_000_000
  const sensors = readings.map(reading => ({
    ...reading,
    radius: measureDistance(reading.sensor, reading.beacon)
  }))

  for (const {radius, sensor: [x,y]} of sensors) {
    let xDist = radius + 1
    let yDist = 0

    while (xDist >= 0) {
      const points = [
        [x+xDist, y+yDist],
        [x-xDist, y+yDist],
        [x+xDist, y-yDist],
        [x-xDist, y-yDist],
      ] as Array<[number, number]>

      const pointsInSearchSpace = points.filter(([a,b]) => a >= 0 && a <= searchSpaceSize && b >=0 && b <= searchSpaceSize)

      for (const point of pointsInSearchSpace) {
        if (sensors.every(({sensor, radius}) => measureDistance(sensor, point) > radius)) {
          return point
        }
      }

      xDist--
      yDist++
    }
  }

  return [-1, -1] as [number, number]
}

const testInput = `Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3`


console.log(countImpossiblePositionsInRow(parseInput(testInput), 10))

const input = readFileSync('./input.txt', {encoding: 'utf-8'})
console.log(countImpossiblePositionsInRow(parseInput(input), 2_000_000))

console.log(calculateTuningFrequency(searchPerimetersForFreePoint(parseInput(input))))

