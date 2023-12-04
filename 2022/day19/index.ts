type ResourceName = 'ore' | 'clay' | 'obsidian' | 'geode'


interface FactoryState {
  timeLeft: number
  resources: Record<ResourceName, number>
  robots: Record<ResourceName, number>
  blueprints: Record<ResourceName, Partial<Record<ResourceName, number>>>
}

const baseState: Omit<FactoryState, 'blueprints'> = {
  timeLeft: 24,
  resources: {
    ore: 0,
    clay: 0,
    obsidian: 0,
    geode: 0,
  },
  robots: {
    ore: 1,
    clay: 0,
    obsidian: 0,
    geode: 0,
  },
}

function memoize<T extends (...args: any[]) => any>(fn: T) {
  const memo = new Map<string, ReturnType<T>>()

  return (...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args)
    const memoResult = memo.get(key)
    if (memoResult) {
      return memoResult
    }

    const result = fn(...args)
    memo.set(key, result)

    return result
  }
}

const findMaxGeodes = memoize((state: FactoryState): number => {
  if (state.timeLeft === 0) {
    return state.resources.geode
  }

  // const maxSpending = Object.fromEntries(
  //   Object.entries(state.blueprints).map(([]))
  // )
  const maxSpending = {} as Record<ResourceName, number>

  Object.values(state.blueprints).forEach((blueprint) => {
    Object.entries(blueprint).forEach(([resourceName, amount]) => {
      maxSpending[resourceName as ResourceName] = Math.max(maxSpending[resourceName as ResourceName] ?? 0, amount)
    })
  })

  const statesAfterBuildingARobot = Object.entries(state.blueprints)
    .map(([blueprintKey, blueprint]): FactoryState => {
      return {
        timeLeft: state.timeLeft - 1,
        resources: Object.fromEntries(
          Object.entries(state.resources)
            .map(([key, prevValue]) => [key, prevValue + state.robots[key as ResourceName] - (blueprint[key as ResourceName] ?? 0)])
        ) as FactoryState['resources'],
        blueprints: state.blueprints,
        robots: {
          ...state.robots,
          [blueprintKey as ResourceName]: state.robots[blueprintKey as ResourceName] + 1,
        }
      }
    })
    .filter(state => Object.values(state.resources).every(resource => resource >= 0))
    .filter(state => Object.entries(state.robots).every(([resource, robots]) => resource === 'geode' || robots <= maxSpending[resource as ResourceName]))

  const stateWithoutBuildingARobot = {
    timeLeft: state.timeLeft - 1,
    resources: Object.fromEntries(
      Object.entries(state.resources)
        .map(([key, prevValue]) => [key, prevValue + state.robots[key as ResourceName]])
    ) as FactoryState['resources'],
    blueprints: state.blueprints,
    robots: state.robots,
  }


  return statesAfterBuildingARobot.reduce(
    (currentBest, state) => Math.max(currentBest, findMaxGeodes(state)),
    findMaxGeodes(stateWithoutBuildingARobot)
  )
})

console.log(findMaxGeodes({
  ...baseState,
  blueprints: {
    ore: {
      ore: 4,
    },
    clay: {
      ore: 4
    },
    obsidian: {
      ore: 3,
      clay: 14,
    },
    geode: {
      ore: 2,
      obsidian: 7
    }
  }
}))