import type { Prisma, StudyProgress } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.StudyProgressCreateArgs>({
  studyProgress: {
    one: {
      data: {
        date: '2025-03-08T14:05:10.279Z',
        updatedAt: '2025-03-08T14:05:10.279Z',
      },
    },
    two: {
      data: {
        date: '2025-03-08T14:05:10.279Z',
        updatedAt: '2025-03-08T14:05:10.279Z',
      },
    },
  },
})

export type StandardScenario = ScenarioData<StudyProgress, 'studyProgress'>
