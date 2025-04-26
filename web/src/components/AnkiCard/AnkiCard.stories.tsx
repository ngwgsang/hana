// Pass props to your component by passing an `args` object to your story
//
// ```tsx
// export const Primary: Story = {
//  args: {
//    propName: propValue
//  }
// }
// ```
//
// See https://storybook.js.org/docs/7/writing-stories/args

import type { Meta, StoryObj } from '@storybook/react'

import AnkiCard from './AnkiCard'

const meta: Meta<typeof AnkiCard> = {
  component: AnkiCard,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof AnkiCard>

export const Primary: Story = {}
