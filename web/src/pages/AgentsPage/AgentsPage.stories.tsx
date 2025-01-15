import type { Meta, StoryObj } from '@storybook/react'

import AgentsPage from './AgentsPage'

const meta: Meta<typeof AgentsPage> = {
  component: AgentsPage,
}

export default meta

type Story = StoryObj<typeof AgentsPage>

export const Primary: Story = {}
