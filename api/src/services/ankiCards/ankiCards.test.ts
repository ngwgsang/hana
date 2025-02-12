import type { AnkiCard } from '@prisma/client'

import {
  ankiCards,
  ankiCard,
  createAnkiCard,
  updateAnkiCard,
  deleteAnkiCard,
} from './ankiCards'
import type { StandardScenario } from './ankiCards.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('ankiCards', () => {
  scenario('returns all ankiCards', async (scenario: StandardScenario) => {
    const result = await ankiCards()

    expect(result.length).toEqual(Object.keys(scenario.ankiCard).length)
  })

  scenario('returns a single ankiCard', async (scenario: StandardScenario) => {
    const result = await ankiCard({ id: scenario.ankiCard.one.id })

    expect(result).toEqual(scenario.ankiCard.one)
  })

  scenario('creates a ankiCard', async () => {
    const result = await createAnkiCard({
      input: { front: 'String', back: 'String' },
    })

    expect(result.front).toEqual('String')
    expect(result.back).toEqual('String')
  })

  scenario('updates a ankiCard', async (scenario: StandardScenario) => {
    const original = (await ankiCard({
      id: scenario.ankiCard.one.id,
    })) as AnkiCard
    const result = await updateAnkiCard({
      id: original.id,
      input: { front: 'String2' },
    })

    expect(result.front).toEqual('String2')
  })

  scenario('deletes a ankiCard', async (scenario: StandardScenario) => {
    const original = (await deleteAnkiCard({
      id: scenario.ankiCard.one.id,
    })) as AnkiCard
    const result = await ankiCard({ id: original.id })

    expect(result).toEqual(null)
  })
})
