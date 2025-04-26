import type { Meta, StoryObj } from '@storybook/react'

import BasicLayout from './BasicLayout'

const meta: Meta<typeof BasicLayout> = {
  component: BasicLayout,
}

export default meta

type Story = StoryObj<typeof BasicLayout>

export const Primary: Story = {}
