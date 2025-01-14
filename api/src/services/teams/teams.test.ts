import type { Team } from '@prisma/client'

import { teams, team, createTeam, updateTeam, deleteTeam } from './teams'
import type { StandardScenario } from './teams.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('teams', () => {
  scenario('returns all teams', async (scenario: StandardScenario) => {
    const result = await teams()

    expect(result.length).toEqual(Object.keys(scenario.team).length)
  })

  scenario('returns a single team', async (scenario: StandardScenario) => {
    const result = await team({ id: scenario.team.one.id })

    expect(result).toEqual(scenario.team.one)
  })

  scenario('creates a team', async () => {
    const result = await createTeam({
      input: { name: 'String', updatedAt: '2025-01-14T16:14:35.968Z' },
    })

    expect(result.name).toEqual('String')
    expect(result.updatedAt).toEqual(new Date('2025-01-14T16:14:35.968Z'))
  })

  scenario('updates a team', async (scenario: StandardScenario) => {
    const original = (await team({ id: scenario.team.one.id })) as Team
    const result = await updateTeam({
      id: original.id,
      input: { name: 'String2' },
    })

    expect(result.name).toEqual('String2')
  })

  scenario('deletes a team', async (scenario: StandardScenario) => {
    const original = (await deleteTeam({ id: scenario.team.one.id })) as Team
    const result = await team({ id: original.id })

    expect(result).toEqual(null)
  })
})
