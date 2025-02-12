import type { AnkiTag } from '@prisma/client'

import {
  ankiTags,
  ankiTag,
  createAnkiTag,
  updateAnkiTag,
  deleteAnkiTag,
} from './ankiTags'
import type { StandardScenario } from './ankiTags.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('ankiTags', () => {
  scenario('returns all ankiTags', async (scenario: StandardScenario) => {
    const result = await ankiTags()

    expect(result.length).toEqual(Object.keys(scenario.ankiTag).length)
  })

  scenario('returns a single ankiTag', async (scenario: StandardScenario) => {
    const result = await ankiTag({ id: scenario.ankiTag.one.id })

    expect(result).toEqual(scenario.ankiTag.one)
  })

  scenario('creates a ankiTag', async () => {
    const result = await createAnkiTag({
      input: { name: 'String1977722' },
    })

    expect(result.name).toEqual('String1977722')
  })

  scenario('updates a ankiTag', async (scenario: StandardScenario) => {
    const original = (await ankiTag({ id: scenario.ankiTag.one.id })) as AnkiTag
    const result = await updateAnkiTag({
      id: original.id,
      input: { name: 'String59816862' },
    })

    expect(result.name).toEqual('String59816862')
  })

  scenario('deletes a ankiTag', async (scenario: StandardScenario) => {
    const original = (await deleteAnkiTag({
      id: scenario.ankiTag.one.id,
    })) as AnkiTag
    const result = await ankiTag({ id: original.id })

    expect(result).toEqual(null)
  })
})
