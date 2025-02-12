import type { Prisma, AnkiCard } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.AnkiCardCreateArgs>({
  ankiCard: {
    one: { data: { front: 'String', back: 'String' } },
    two: { data: { front: 'String', back: 'String' } },
  },
})

export type StandardScenario = ScenarioData<AnkiCard, 'ankiCard'>
