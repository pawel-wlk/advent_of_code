interface Tunnel {
  to: string
}

interface Valve {
  label: string
  flow: number
  neighbors: string[]
}

type Cave = Valve[]

interface Memo {
  [label: string]: {
    [minutesRemaining: number]: {
      totalFlow: number,
      openValves: string[]
    }
  }
}

function sortGraph(cave: Cave) {
  const sorted: Valve[] = []

  function dfs(label = 'AA') {
    const prevLength = sorted.length
    const vertex = cave.find(v => v.label === label)!
    sorted.push(vertex)

    for (const n of vertex.neighbors) {
      if (!sorted.find(v => v.label === n)) dfs(n)
    }

    if(prevLength === sorted.length) return
  }

  dfs()

  return sorted
}

function traverseGraph(cave: Cave) {
  const memo: Memo = {
    AA: {
      30: {
        totalFlow: 0,
        openValves: []
      }
    }
  }
  const sortedValves = sortGraph(cave)

  for (let i = 0; i<100; i++) {
    for (const valve of cave) {
      if (!memo[valve.label]) memo[valve.label] = {}
      for (const [minutesRemaining, {totalFlow, openValves}] of Object.entries(memo[valve.label])) {
        if (Number(minutesRemaining) === 1) {
          continue
        }
        const newTime = Number(minutesRemaining) - 1
        if ( !openValves.includes(valve.label)) {
          memo[valve.label][newTime] = {
            openValves: [...openValves, valve.label],
            totalFlow: totalFlow + valve.flow * newTime
          }
        }
        for (const neighbor of valve.neighbors) {
          if (!memo[neighbor]) memo[neighbor] = {}

          if (!memo[neighbor][newTime] || memo[neighbor][newTime].totalFlow < totalFlow) {
            memo[neighbor][newTime] = {
              totalFlow, openValves
            }
          }
        }
      }
    }
  }


  return Object.values(memo).map(valveMemo => valveMemo[1]?.totalFlow).reduce((a,b) => Math.max(a,b))
}

function parseGraph(input: string): Cave {
  const vertexRegex = /Valve (?<label>\w+) has flow rate=(?<flow>\d+); tunnels? leads? to valves? (?<nextValves>[\w, ]+)/

  return input.split('\n').map(line => {
    const groups = line.match(vertexRegex)?.groups

    if (!groups) return

    return {
      label: groups.label,
      flow: parseInt(groups.flow),
      neighbors: groups.nextValves.split(', ')
    }
  }).filter((node): node is Valve => !!node)
}

console.log(traverseGraph(parseGraph(`Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
Valve BB has flow rate=13; tunnels lead to valves CC, AA
Valve CC has flow rate=2; tunnels lead to valves DD, BB
Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
Valve EE has flow rate=3; tunnels lead to valves FF, DD
Valve FF has flow rate=0; tunnels lead to valves EE, GG
Valve GG has flow rate=0; tunnels lead to valves FF, HH
Valve HH has flow rate=22; tunnel leads to valve GG
Valve II has flow rate=0; tunnels lead to valves AA, JJ
Valve JJ has flow rate=21; tunnel leads to valve II`)))