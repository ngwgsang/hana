import type { Prisma, Task } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.TaskCreateArgs>({
  task: {
    one: {
      data: {
        name: 'String',
        config: 'String',
        updatedAt: '2025-01-14T16:15:01.096Z',
      },
    },
    two: {
      data: {
        name: 'String',
        config: 'String',
        updatedAt: '2025-01-14T16:15:01.096Z',
      },
    },
  },
})

export type StandardScenario = ScenarioData<Task, 'task'>
