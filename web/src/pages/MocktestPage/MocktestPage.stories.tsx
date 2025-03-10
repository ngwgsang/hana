import type { Meta, StoryObj } from '@storybook/react'

import MocktestPage from './MocktestPage'

const meta: Meta<typeof MocktestPage> = {
  component: MocktestPage,
}

export default meta

type Story = StoryObj<typeof MocktestPage>

export const Primary: Story = {}
