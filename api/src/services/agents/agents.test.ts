import type { Agent } from '@prisma/client'

import { agents, agent, createAgent, updateAgent, deleteAgent } from './agents'
import type { StandardScenario } from './agents.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('agents', () => {
  scenario('returns all agents', async (scenario: StandardScenario) => {
    const result = await agents()

    expect(result.length).toEqual(Object.keys(scenario.agent).length)
  })

  scenario('returns a single agent', async (scenario: StandardScenario) => {
    const result = await agent({ id: scenario.agent.one.id })

    expect(result).toEqual(scenario.agent.one)
  })

  scenario('creates a agent', async (scenario: StandardScenario) => {
    const result = await createAgent({
      input: {
        avatar: 'String',
        name: 'String',
        settings: 'String',
        teamId: scenario.agent.two.teamId,
        updatedAt: '2025-01-14T16:14:49.113Z',
      },
    })

    expect(result.avatar).toEqual('String')
    expect(result.name).toEqual('String')
    expect(result.settings).toEqual('String')
    expect(result.teamId).toEqual(scenario.agent.two.teamId)
    expect(result.updatedAt).toEqual(new Date('2025-01-14T16:14:49.113Z'))
  })

  scenario('updates a agent', async (scenario: StandardScenario) => {
    const original = (await agent({ id: scenario.agent.one.id })) as Agent
    const result = await updateAgent({
      id: original.id,
      input: { avatar: 'String2' },
    })

    expect(result.avatar).toEqual('String2')
  })

  scenario('deletes a agent', async (scenario: StandardScenario) => {
    const original = (await deleteAgent({ id: scenario.agent.one.id })) as Agent
    const result = await agent({ id: original.id })

    expect(result).toEqual(null)
  })
})
