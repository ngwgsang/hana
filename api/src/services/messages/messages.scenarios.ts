import type { Prisma, Message } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.MessageCreateArgs>({
  message: {
    one: {
      data: {
        sender: 'String',
        content: 'String',
        updatedAt: '2025-01-16T13:10:22.115Z',
      },
    },
    two: {
      data: {
        sender: 'String',
        content: 'String',
        updatedAt: '2025-01-16T13:10:22.115Z',
      },
    },
  },
})

export type StandardScenario = ScenarioData<Message, 'message'>
