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

  const stateWithoutBuildingARobot = {
    timeLeft: state.timeLeft - 1,
    resources: Object.fromEntries(
      Object.entries(state.resources)
        .map(([key, prevValue]) => [key, prevValue + state.robots[key as ResourceName]])
    ) as FactoryState['resources'],
    blueprints: state.blueprints,
    robots: state.robots,
  }


  return [...statesAfterBuildingARobot, stateWithoutBuildingARobot]
    .filter(state => Object.values(state.resources).every(resource => resource >= 0))
    .map(findMaxGeodes)
    .reduce((a,b) => Math.max(a,b))
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