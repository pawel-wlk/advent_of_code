import {readFileSync} from 'fs'

const data = readFileSync('./input.txt', { encoding: 'utf-8' })

const opponentScoring: Record<string, number> = {
  A: 1,
  B: 2,
  C: 3,
}

const myScoring: Record<string, number> = {
  X: 1,
  Y: 2,
  Z: 3,
}

const pointDiffScoring: Record<number, number|undefined> = {
  // draw
  0: 3,
  // win
  1: 6,
  [-2]: 6,
}


const rounds = data
  .split('\n')
  .map(line => line.split(' '))

const points = rounds.map(([opponent, me]) => {
  const opponentPoints = opponentScoring[opponent]
  const myPoints = myScoring[me]

  const pointDiff = myPoints - opponentPoints

  return myPoints + (pointDiffScoring[pointDiff] ?? 0)
})

const result = points.reduce((a,b) => a+b)

console.log(result)

const outcomeScoring: Record<string, number> = {
  X: 0,
  Y: 3,
  Z: 6,
}

const points2 = rounds.map(([opponent, outcome]) => {
  let myShapeScore

  if (outcome == 'Y') {
    myShapeScore = opponentScoring[opponent]
  } else if (outcome == 'Z') {
    myShapeScore = opponentScoring[opponent] + 1
    if (myShapeScore == 4) {
      myShapeScore = 1
    }
  } else {
    myShapeScore = (opponentScoring[opponent] - 1) || 3
  }

  return outcomeScoring[outcome] + myShapeScore
})

console.log(points2)
console.log(points2.reduce((a,b) => a+b, 0))