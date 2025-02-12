import type { Prisma, AnkiTag } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.AnkiTagCreateArgs>({
  ankiTag: {
    one: { data: { name: 'String6109454' } },
    two: { data: { name: 'String9211124' } },
  },
})

export type StandardScenario = ScenarioData<AnkiTag, 'ankiTag'>
