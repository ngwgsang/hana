import type { Prisma, Team } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.TeamCreateArgs>({
  team: {
    one: { data: { name: 'String', updatedAt: '2025-01-14T16:14:36.011Z' } },
    two: { data: { name: 'String', updatedAt: '2025-01-14T16:14:36.011Z' } },
  },
})

export type StandardScenario = ScenarioData<Team, 'team'>
