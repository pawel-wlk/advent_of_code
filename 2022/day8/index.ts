import { readFileSync } from "fs"

function countTreesInRow(row: number[]) {
  let highestTreeYet = 0
  let visibleCount = 0

  for (let i = 0; i < row.length; i++) {
    if (row[i] > highestTreeYet) {
      highestTreeYet = row[i]
      visibleCount++
      row[i] = -row[i] // negate so that we don't count it anymore
    } else if (Math.abs(row[i]) > highestTreeYet) {
      highestTreeYet = Math.abs(row[i])
    }
  }

  highestTreeYet = 0

  for (let i = row.length - 1; i >= 0; i--) {
    if (row[i] > highestTreeYet || (row[i] === 0 && i === row.length-1)) {
      highestTreeYet = row[i]
      visibleCount++
      row[i] = -row[i] // negate so that we don't count it anymore
    } else if (Math.abs(row[i]) > highestTreeYet) {
      highestTreeYet = Math.abs(row[i])
    }
  }

  return visibleCount
}


function countVisibleTrees(forest: number[][]) {
  const calcForest = forest.map(row => row.map(tree => tree + 1)) // add 1 to avoid problems with -0 ;)))
  let total = 0
  for (const row of calcForest) {
    total += countTreesInRow(row)
  }


  const invertedForest = calcForest[0].map((_, idx) => calcForest.map(row => row[idx])) 
  for (const column of invertedForest) {
    total += countTreesInRow(column)
  }

  return total
}

function findVisibilityRange(treeI: number, treeJ: number, forest: number[][]): number {
  const tree = forest[treeI][treeJ]

  let topRange = 0
  for (let i=treeI-1; i>=0; i--) {
    topRange++
    if (forest[i][treeJ] >= tree) {
      break
    }
  }

  let bottomRange = 0
  for (let i=treeI+1; i<forest.length; i++) {
    bottomRange++
    if (forest[i][treeJ] >= tree) {
      break
    }
  }

  let leftRange = 0
  for (let j=treeJ-1; j>=0 && forest[treeI][j] < tree; j--) {
    leftRange++
    if (forest[treeI][j] >= tree) {
      break
    }
  }

  let rightRange = 0
  for (let j=treeJ+1; j<forest[treeI].length; j++) {
    rightRange++
    if (forest[treeI][j] >= tree) {
      break
    }
  }

  return topRange * bottomRange * leftRange * rightRange
}

function findMaxVisibilityRange(forest: number[][]) {
  let result = 0

  forest.forEach((row, i) => {
    row.forEach((_, j) => {
      const range = findVisibilityRange(i, j, forest)
      console.log(range)
      result = Math.max(result, range)
    })
  })

  return result
}

function parseForest(forest: string): number[][] {
  return forest.split('\n')
    .map(line => line.split('').map(c => parseInt(c)))
}

// const result = findMaxVisibilityRange(parseForest(`30373
// 25512
// 65332
// 33549
// 35390`))

// const result = countVisibleTrees(parseForest(readFileSync('./input.txt', {encoding: 'utf-8'})))

const result = findMaxVisibilityRange(parseForest(readFileSync('./input.txt', {encoding: 'utf-8'})))

console.log(result)
