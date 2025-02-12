import type { AnkiSch } from '@prisma/client'

import {
  ankiSches,
  ankiSch,
  createAnkiSch,
  updateAnkiSch,
  deleteAnkiSch,
} from './ankiSches'
import type { StandardScenario } from './ankiSches.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('ankiSches', () => {
  scenario('returns all ankiSches', async (scenario: StandardScenario) => {
    const result = await ankiSches()

    expect(result.length).toEqual(Object.keys(scenario.ankiSch).length)
  })

  scenario('returns a single ankiSch', async (scenario: StandardScenario) => {
    const result = await ankiSch({ id: scenario.ankiSch.one.id })

    expect(result).toEqual(scenario.ankiSch.one)
  })

  scenario('deletes a ankiSch', async (scenario: StandardScenario) => {
    const original = (await deleteAnkiSch({
      id: scenario.ankiSch.one.id,
    })) as AnkiSch
    const result = await ankiSch({ id: original.id })

    expect(result).toEqual(null)
  })
})
