import type { Meta, StoryObj } from '@storybook/react'

import TranslateTestPage from './TranslateTestPage'

const meta: Meta<typeof TranslateTestPage> = {
  component: TranslateTestPage,
}

export default meta

type Story = StoryObj<typeof TranslateTestPage>

export const Primary: Story = {}
