import type { Meta, StoryObj } from '@storybook/react'

import LibraryPage from './LibraryPage'

const meta: Meta<typeof LibraryPage> = {
  component: LibraryPage,
}

export default meta

type Story = StoryObj<typeof LibraryPage>

export const Primary: Story = {}
