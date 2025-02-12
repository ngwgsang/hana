import type { Prisma, AnkiSch } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.AnkiSchCreateArgs>({
  ankiSch: { one: { data: {} }, two: { data: {} } },
})

export type StandardScenario = ScenarioData<AnkiSch, 'ankiSch'>
