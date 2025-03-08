import type { StudyProgress } from '@prisma/client'

import {
  studyProgresses,
  studyProgress,
  createStudyProgress,
  updateStudyProgress,
  deleteStudyProgress,
} from './studyProgresses'
import type { StandardScenario } from './studyProgresses.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('studyProgresses', () => {
  scenario(
    'returns all studyProgresses',
    async (scenario: StandardScenario) => {
      const result = await studyProgresses()

      expect(result.length).toEqual(Object.keys(scenario.studyProgress).length)
    }
  )

  scenario(
    'returns a single studyProgress',
    async (scenario: StandardScenario) => {
      const result = await studyProgress({ id: scenario.studyProgress.one.id })

      expect(result).toEqual(scenario.studyProgress.one)
    }
  )

  scenario('creates a studyProgress', async () => {
    const result = await createStudyProgress({
      input: {
        date: '2025-03-08T14:05:10.176Z',
        updatedAt: '2025-03-08T14:05:10.176Z',
      },
    })

    expect(result.date).toEqual(new Date('2025-03-08T14:05:10.176Z'))
    expect(result.updatedAt).toEqual(new Date('2025-03-08T14:05:10.176Z'))
  })

  scenario('updates a studyProgress', async (scenario: StandardScenario) => {
    const original = (await studyProgress({
      id: scenario.studyProgress.one.id,
    })) as StudyProgress
    const result = await updateStudyProgress({
      id: original.id,
      input: { date: '2025-03-09T14:05:10.196Z' },
    })

    expect(result.date).toEqual(new Date('2025-03-09T14:05:10.196Z'))
  })

  scenario('deletes a studyProgress', async (scenario: StandardScenario) => {
    const original = (await deleteStudyProgress({
      id: scenario.studyProgress.one.id,
    })) as StudyProgress
    const result = await studyProgress({ id: original.id })

    expect(result).toEqual(null)
  })
})
