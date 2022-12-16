interface Tunnel {
  to: string
}

interface Valve {
  label: string
  flow: number
  neighbors: string[]
}

type Cave = Valve[]

function traverseGraph(cave: Cave) {
  const startingValve = cave.find(v => v.label === 'AA')!

  const valvesStack = [{valve: startingValve, remainingMinutes: 30, openValves: [] as string[], flow: 0}]
  let next: typeof valvesStack[number] | undefined
  
  let results: typeof valvesStack = []

  while (next = valvesStack.shift()) {
    const {valve, remainingMinutes, openValves, flow} = next

    if (remainingMinutes === 0) {
      results.push(next)
      continue
    }

    const hasOpenedValve = remainingMinutes >= 2 && !openValves.includes(valve.label)

    for (const neighbor of valve.neighbors) {
      const newRemainingMinutes = remainingMinutes - (hasOpenedValve ? 2 : 1)

      valvesStack.push({
        valve: cave.find(v => v.label === neighbor)!,
        remainingMinutes: newRemainingMinutes,
        openValves: [...openValves, ...(hasOpenedValve ? [valve.label] : [])],
        flow: flow + (hasOpenedValve ? newRemainingMinutes * valve.flow : 0),
      })
    }
  }

  return results.map(result => result.flow).reduce((a,b) => Math.max(a, b), 0)
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