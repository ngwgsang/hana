import type { Prisma, Agent } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.AgentCreateArgs>({
  agent: {
    one: {
      data: {
        avatar: 'String',
        name: 'String',
        settings: 'String',
        updatedAt: '2025-01-14T16:14:49.183Z',
        team: {
          create: { name: 'String', updatedAt: '2025-01-14T16:14:49.183Z' },
        },
      },
    },
    two: {
      data: {
        avatar: 'String',
        name: 'String',
        settings: 'String',
        updatedAt: '2025-01-14T16:14:49.183Z',
        team: {
          create: { name: 'String', updatedAt: '2025-01-14T16:14:49.183Z' },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Agent, 'agent'>
